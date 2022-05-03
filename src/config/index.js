const path = require('path')

const envPath = path.resolve(__basedir, "../.env");

require("dotenv").config({ path: envPath });

module.exports = process.env