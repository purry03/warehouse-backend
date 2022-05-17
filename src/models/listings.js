const pool = require("../database/postgres");

const add = async (user_id, filename, title, description, inventory, price) => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await pool.connect();

            await client.query("INSERT INTO listings(user_id,img,title,description,inventory,price) VALUES($1,$2,$3,$4,$5,$6)", [user_id, filename, title, description, inventory, price]);

            client.release();
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
}

const find = async (query) => {
    try {
        const client = await pool.connect();

        const listings = (await client.query("SELECT * FROM listings WHERE listing_id = $1", [query])).rows;

        client.release();
        return listings;
    }
    catch (err) {
        throw err;
    }
}


const findByID = async (id) => {
    try {
        const client = await pool.connect();

        const listings = (await client.query("SELECT * FROM listings WHERE listing_id = $1", [id])).rows[0];

        client.release();
        return listings;
    }
    catch (err) {
        throw err;
    }
}


const removeByID = async (id) => {
    try {
        const client = await pool.connect();
        await client.query("DELETE FROM listings WHERE listing_id = $1", [id]);

        client.release();
    }
    catch (err) {
        throw err;
    }
}




const findAll = async () => {
    try {
        const client = await pool.connect();

        const listings = (await client.query("SELECT * FROM listings")).rows;

        client.release();
        return listings;
    }
    catch (err) {
        throw err;
    }
}

const findByUsername = async (username) => {
    try {
        const client = await pool.connect();

        const user = (await client.query("SELECT * FROM users WHERE username=$1", [username])).rows[0];

        const listings = (await client.query("SELECT * FROM listings WHERE user_id = $1", [user.user_id])).rows;

        client.release();
        return listings;
    }
    catch (err) {
        throw err;
    }
}

module.exports = { add, find, findAll, findByID, removeByID, findByUsername };