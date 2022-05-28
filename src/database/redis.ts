const { createClient } = require('redis');

const client = createClient();

client.connect();

client.on('error', (err: string) => console.log('Redis Client Error: ', err));

const set = async (key: string, value: string) => {
  await client.set(key, value);
};

const get = async (key: string) => {
  const value:string = await client.get(key);
  return value;
};

export { set, get };
