
const envPath = require('path').resolve(__dirname, '../../.env');

require('dotenv').config({ path: envPath });

module.exports = process.env;
