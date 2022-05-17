const { createClient } = require('redis');

const client = createClient();

client.connect();

client.on('error', (err) => console.log('Redis Client Error: ', err));

const set = async (key, value) => {
    await client.set(key, value);
};

const get = async (key) => {
    const value = await client.get(key);
    return value;
}

module.exports = { set, get };