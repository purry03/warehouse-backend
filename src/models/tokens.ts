const { redis } = require('../database');

const find = async (username: string) => {
  const refreshToken = await redis.get(username);
  return (refreshToken);
};

const add = async (username: string, encryptedRefreshToken:string) => {
  await redis.set(username, encryptedRefreshToken);
  return (true);
};

const update = async (username: string, newEncryptedRefreshToken:string) => {
  await redis.set(username, newEncryptedRefreshToken);
  return (true);
};

export { find, add, update };
