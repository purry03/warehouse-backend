/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createClient } from "redis";

// @ts-ignore
const client = createClient({url : "redis://warehouse-redis:6379"});


client.on('error', (err: string) => console.log('Redis Client Error: ', err));

async function connect(){
 await client.connect();
}

function closeInstance() {
  client.quit()
}

connect();

const set = async (key: string, value: string) => {
  await client.set(key, value);
};

const get = async (key: string):Promise<string> => {
  const value:string = await client.get(key);
  return value;
};

export default { set, get, closeInstance };
