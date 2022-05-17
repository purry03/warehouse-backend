const models = require("../models");
const services = require("../services");

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const refresh = async (username, refreshToken) => {

    return new Promise(async (resolve, reject) => {
        try {

            const encryptedRefreshToken = services.crypto.encrypt(refreshToken);

            const dbToken = await services.crypto.decrypt(await models.tokens.find(username));


            if (!dbToken) {
                resolve({
                    status: 401,
                    body: { err: "invalid refresh token" }
                });
                return;
            }

            if (dbToken != refreshToken) {
                resolve({
                    status: 401,
                    body: { err: "invalid refresh token" }
                });
                return;
            }

            const user = await models.users.findByUsername(username);

            const currentTime = new Date();
            const accessToken = jwt.sign({ createdAt: currentTime, username: user.username, userType: user.type }, process.env.SECRET, { expiresIn: '1h' });
            const newRefreshToken = crypto.randomBytes(8).toString("hex");
            const newEncryptedRefreshToken = services.crypto.encrypt(newRefreshToken);

            await models.tokens.update(username, newEncryptedRefreshToken, currentTime);

            resolve({
                "status": 200,
                "body": {
                    username: user.username,
                    access_token: accessToken,
                    token_type: "jwt",
                    expires_in: 3600,
                    refresh_token: newRefreshToken
                }
            });

        }
        catch (err) {
            reject({
                status: 500,
                body: { err }
            });
        }

    });
}


module.exports = { refresh }