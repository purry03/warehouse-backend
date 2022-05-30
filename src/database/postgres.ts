import {Pool} from 'pg';

const pool:Pool = new Pool({
  user: 'postgres',
  password: 'crack',
  database: 'warehouse',
  host: 'localhost',
  port: 5432,
});

export default pool;
