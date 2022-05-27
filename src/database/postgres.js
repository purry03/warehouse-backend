const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'crack',
  database: 'warehouse',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
