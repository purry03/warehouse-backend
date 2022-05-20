const pool = require("../database/postgres");

const add = async (currentUser, listingId, quantity, prebookingNumber) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const user = (await client.query("SELECT * FROM users WHERE username = $1", [currentUser.username])).rows[0];

            const listing = (await client.query("SELECT inventory FROM listings WHERE listing_id = $1", [listingId])).rows[0];

            if (!listing) {
                resolve({ err: "listing does not exist" });
                return;
            }

            const newInventory = listing.inventory - parseInt(quantity);

            if (newInventory < 0) {
                resolve({ err: "not enough inventory" });
                return;
            }

            await client.query("UPDATE listings SET inventory = $1 WHERE listing_id = $2 ", [newInventory, listingId]);


            const currentDate = new Date();

            const newBooking = (await client.query("INSERT INTO prebookings(prebooking_number,listing_id,user_id,quantity,created_at) VALUES($1,$2,$3,$4,$5) RETURNING *", [prebookingNumber, listingId, user.user_id, quantity, currentDate])).rows[0];

            await client.query('COMMIT')

            resolve(newBooking);
        }
        catch (err) {

            await client.query("ROLLBACK");

            reject(err);
        }
        finally {
            client.release();

        }
    });
}

const remove = async (prebooking_number) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            //get quantity of prebook
            const prebook = (await client.query("SELECT user_id,listing_id,quantity FROM prebookings WHERE prebooking_number = $1", [prebooking_number])).rows[0];

            if (!prebook) {
                await client.query('ROLLBACK');
                resolve({ err: "invalid prebooking number" });
                return;
            }

            //add to inventory

            const listing = (await client.query("SELECT inventory FROM listings WHERE listing_id = $1", [prebook.listing_id])).rows[0];

            const newInventory = listing.inventory + prebook.quantity;

            await client.query("UPDATE listings SET inventory = $1 WHERE listing_id = $2", [newInventory, prebook.listing_id]);

            //delete prebooking

            await client.query("DELETE FROM prebookings WHERE prebooking_number = $1", [prebooking_number]);


            await client.query('COMMIT')

            resolve(true);
        }
        catch (err) {
            console.log(err);
            await client.query("ROLLBACK");

            reject(err);
        }
        finally {
            client.release();

        }
    });
}

const approve = async (prebooking_number) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");


            await client.query("DELETE FROM prebookings WHERE prebooking_number = $1", [prebooking_number]);


            await client.query('COMMIT')

            resolve(true);
        }
        catch (err) {
            console.log(err);
            await client.query("ROLLBACK");

            reject(err);
        }
        finally {
            client.release();

        }
    });
}

const get = async (prebookingNumber) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const prebooking = (await client.query("SELECT * FROM prebookings WHERE prebooking_number = $1", [prebookingNumber])).rows[0];
            const user = (await client.query("SELECT * FROM users WHERE user_id = $1", [prebooking.user_id])).rows[0];
            const listing = (await client.query("SELECT * FROM listings WHERE listing_id = $1", [prebooking.listing_id])).rows[0];


            resolve({ username: user.username, quantity: prebooking.quantity, productTitle: listing.title, productPrice: listing.price });
        }
        catch (err) {

            await client.query("ROLLBACK");

            reject(err);
        }
        finally {
            client.release();

        }
    });
}

module.exports = { add, remove, approve, get };