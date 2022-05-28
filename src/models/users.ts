const pool = require('../database/postgres');

const create = async (username:string, passwordHash:string, type:string) => {
  const client = await pool.connect();

  await client.query('INSERT INTO users(username,password,type) VALUES($1,$2,$3) RETURNING *', [username, passwordHash, type]);

  client.release();

  return (true);
};

const findByUsername = async (username:string) => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE username = $1', [username])).rows[0];

  client.release();

  return (user);
};

const findById = async (userID:string) => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE user_id = $1', [userID])).rows[0];

  client.release();

  return (user);
};

export = { create, findByUsername, findById };
