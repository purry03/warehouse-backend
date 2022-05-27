const pool = require('../database/postgres');

const add = async (currentUser: User, listingId:string, quantity:string, prebookingNumber:string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const user = (await client.query('SELECT * FROM users WHERE username = $1', [currentUser.username])).rows[0];

    const listing = (await client.query('SELECT inventory FROM listings WHERE listing_id = $1', [listingId])).rows[0];

    if (!listing) {
      return ({ err: 'listing does not exist' });
    }

    const newInventory = listing.inventory - parseInt(quantity, 10);

    if (newInventory < 0) {
      return ({ err: 'not enough inventory' });
    }

    await client.query('UPDATE listings SET inventory = $1 WHERE listing_id = $2 ', [newInventory, listingId]);

    const currentDate = new Date();

    const newBooking = (await client.query('INSERT INTO prebookings(prebooking_number,listing_id,user_id,quantity,created_at) VALUES($1,$2,$3,$4,$5) RETURNING *', [prebookingNumber, listingId, user.user_id, quantity, currentDate])).rows[0];

    await client.query('COMMIT');

    return (newBooking);
  } catch (err) {
    await client.query('ROLLBACK');

    throw (err);
  } finally {
    client.release();
  }
};

const remove = async (prebookingNumber:string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // get quantity of prebook
    const prebook = (await client.query('SELECT user_id,listing_id,quantity FROM prebookings WHERE prebooking_number = $1', [prebookingNumber])).rows[0];

    if (!prebook) {
      await client.query('ROLLBACK');
      return ({ err: 'invalid prebooking number' });
    }

    // add to inventory

    const listing = (await client.query('SELECT inventory FROM listings WHERE listing_id = $1', [prebook.listing_id])).rows[0];

    const newInventory = listing.inventory + prebook.quantity;

    await client.query('UPDATE listings SET inventory = $1 WHERE listing_id = $2', [newInventory, prebook.listing_id]);

    // delete prebooking

    await client.query('DELETE FROM prebookings WHERE prebooking_number = $1', [prebookingNumber]);

    await client.query('COMMIT');

    return (true);
  } catch (err) {
    await client.query('ROLLBACK');
    throw (err);
  } finally {
    client.release();
  }
};

const approve = async (prebookingNumber:string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM prebookings WHERE prebooking_number = $1', [prebookingNumber]);

    await client.query('COMMIT');

    return (true);
  } catch (err) {
    await client.query('ROLLBACK');

    throw (err);
  } finally {
    client.release();
  }
};

const get = async (prebookingNumber:string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const prebooking = (await client.query('SELECT * FROM prebookings WHERE prebooking_number = $1', [prebookingNumber])).rows[0];
    const user = (await client.query('SELECT * FROM users WHERE user_id = $1', [prebooking.user_id])).rows[0];
    const listing = (await client.query('SELECT * FROM listings WHERE listing_id = $1', [prebooking.listing_id])).rows[0];

    return ({
      username: user.username,
      quantity: prebooking.quantity,
      productTitle: listing.title,
      productPrice: listing.price,
    });
  } catch (err) {
    await client.query('ROLLBACK');

    throw (err);
  } finally {
    client.release();
  }
};

export {
  add, remove, approve, get,
};
