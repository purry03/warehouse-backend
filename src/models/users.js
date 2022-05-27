const pool = require('../database/postgres');

const create = async (username, passwordHash, type) => {
  const client = await pool.connect();

  await client.query('INSERT INTO users(username,password,type) VALUES($1,$2,$3) RETURNING *', [username, passwordHash, type]);

  client.release();

  return (true);
};

const findByUsername = async (username) => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE username = $1', [username])).rows[0];

  client.release();

  return (user);
};

const findById = async (userID) => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE user_id = $1', [userID])).rows[0];

  client.release();

  return (user);
};

module.exports = { create, findByUsername, findById };
