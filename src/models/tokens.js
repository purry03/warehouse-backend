const { reject } = require("bcrypt/promises");
const pool = require("../database/postgres");


const find = async (encryptedRefreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await pool.connect();

            const dbToken = (await pool.query("SELECT * FROM tokens WHERE refresh_token = $1", [encryptedRefreshToken])).rows[0];

            client.release();

            resolve(dbToken);
        }
        catch (err) {
            reject(err);
        }
    });
};

const add = async (username, encryptedRefreshToken, currentTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await pool.connect();

            await client.query("INSERT INTO tokens(user_id,refresh_token,created_at) VALUES((SELECT user_id FROM users WHERE username = $1),$2,$3) ON CONFLICT(user_id) DO UPDATE SET refresh_token = EXCLUDED.refresh_token,created_at = EXCLUDED.created_at", [username, encryptedRefreshToken, currentTime]);

            client.release();

            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

const update = async (user_id, newEncryptedRefreshToken, currentTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await pool.connect();

            await client.query("UPDATE tokens SET refresh_token = $2 , created_at = $3 WHERE user_id = $1", [user_id, newEncryptedRefreshToken, currentTime]);

            client.release();

            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = { find, add, update };