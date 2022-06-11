/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Pool} from 'pg';

const pool:Pool = new Pool({
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: 'warehouse',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

export default pool;
