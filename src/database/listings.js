const pool = require("../pool");

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

module.exports = { add };