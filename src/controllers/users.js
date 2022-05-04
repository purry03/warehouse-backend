const config = require("../config");

const models = require("../models");
const services = require("../services");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = async (username, password, type) => {

    return new Promise(async (resolve, reject) => {
        try {
            const saltRounds = 10;

            const passwordHash = bcrypt.hashSync(password, saltRounds);

            await models.users.create(username, passwordHash, type);
            resolve({ status: 200 });
            return;
        }
        catch (err) {
            reject({ status: 500, body: { err: err.detail } });
            return;
        }

    });
};

const login = async (username, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            const user = await models.users.findByUsername(username);

            if (!user) {
                resolve({ status: 401, body: "incorrrect credentials" });
            }

            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {

                const currentTime = new Date();

                const accessToken = jwt.sign({ createdAt: currentTime, username: user.username, userType: user.type }, config.SECRET, { expiresIn: '1h' });
                const refreshToken = crypto.randomBytes(8).toString("hex");
                const encryptedRefreshToken = services.crypto.encrypt(refreshToken);

                await models.tokens.add(username, encryptedRefreshToken, currentTime);

                resolve({
                    status: 200,
                    body: {
                        username: username,
                        access_token: accessToken,
                        token_type: "jwt",
                        expires_in: 3600,
                        refresh_token: refreshToken
                    }
                });

            }

            else {
                resolve({
                    status: 401,
                    body: { "err": "incorrect credentials" }
                });
            }

        }
        catch (err) {

            reject({
                status: 500,
                body: { err: err.detail }
            });
        }
    });

}

module.exports = { register, login }