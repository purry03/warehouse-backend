const pool = require("../database/postgres");

const create = async (username, passwordHash, type) => {

    return new Promise(async (resolve, reject) => {

        try {
            const client = await pool.connect();

            await client.query("INSERT INTO users(username,password,type) VALUES($1,$2,$3) RETURNING *", [username, passwordHash, type]);

            client.release();

            resolve(true);
        }
        catch (err) {
            reject(err);
        }

    });

}

const findByUsername = async (username) => {

    return new Promise(async (resolve, reject) => {

        try {
            const client = await pool.connect();

            const user = (await client.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];

            client.release();

            resolve(user);

        }
        catch (err) {
            reject(err);
        }

    });

}

const findById = async (user_id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const client = await pool.connect();

            const user = (await client.query("SELECT * FROM users WHERE user_id = $1", [user_id])).rows[0];

            client.release();

            resolve(user);
        }
        catch (err) {
            reject(err);
        }

    });

}

module.exports = { create, findByUsername, findById };