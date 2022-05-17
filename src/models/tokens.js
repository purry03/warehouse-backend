const { postgres, redis } = require("../database/");


const find = async (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(username);
            const refreshToken = await redis.get(username);
            resolve(refreshToken);
        }
        catch (err) {
            reject(err);
        }
    });
};

const add = async (username, encryptedRefreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {

            await redis.set(username, encryptedRefreshToken);

            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

const update = async (username, newEncryptedRefreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            await redis.set(username, newEncryptedRefreshToken)
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = { find, add, update };