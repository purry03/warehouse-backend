import pool from '../database/postgres';

const add = async (userID:string, filename:string, title:string, description:string, inventory:number, price:number):Promise<boolean> => {
  const client = await pool.connect();
  await client.query('INSERT INTO listings(user_id,img,title,description,inventory,price) VALUES($1,$2,$3,$4,$5,$6)', [userID, filename, title, description, inventory, price]);
  client.release();
  return (true);
};

const find = async (query:string):Promise<DbListing[]> => {
  const client = await pool.connect();
  const listings = (await client.query('SELECT * FROM listings WHERE listing_id = $1', [query])).rows;
  client.release();
  return listings;
};

const findByID = async (id:string):Promise<DbListing[]> => {
  const client = await pool.connect();
  const listings = (await client.query('SELECT * FROM listings WHERE listing_id = $1', [id])).rows[0];
  client.release();
  return listings;
};

const removeByID = async (id:string):Promise<boolean> => {
  const client = await pool.connect();
  await client.query('DELETE FROM listings WHERE listing_id = $1', [id]);
  client.release();
  return(true);
};

const findAll = async ():Promise<DbListing[]> => {
  const client = await pool.connect();
  const listings = (await client.query('SELECT * FROM listings ORDER BY title ASC')).rows;
  client.release();
  return listings;
};

const findByUsername = async (username:string):Promise<DbListing[]> => {
  const client = await pool.connect();
  const user = (await client.query('SELECT * FROM users WHERE username=$1', [username])).rows[0];
  const listings = (await client.query('SELECT * FROM listings WHERE user_id = $1', [user.user_id])).rows;
  client.release();
  return listings;
};

export default{
  add, find, findAll, findByID, removeByID, findByUsername,
};
