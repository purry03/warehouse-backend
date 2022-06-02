import { Pool } from 'pg';
import pool from '../database/postgres';

const create = async (username:string, passwordHash:string, type:string):Promise<boolean> => {
  const client = await pool.connect();

  await client.query('INSERT INTO users(username,password,type) VALUES($1,$2,$3) RETURNING *', [username, passwordHash, type]);

  client.release();

  return (true);
};

const findByUsername = async (username:string):Promise<DbUser> => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE username = $1', [username])).rows[0];

  client.release();

  return (user);
};

const findById = async (userID:string):Promise<DbUser> => {
  const client = await pool.connect();

  const user = (await client.query('SELECT * FROM users WHERE user_id = $1', [userID])).rows[0];

  client.release();

  return (user);
};

export default { create, findByUsername, findById };
