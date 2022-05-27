const { redis } = require('../database');

const find = async (username) => {
  const refreshToken = await redis.get(username);
  return (refreshToken);
};

const add = async (username, encryptedRefreshToken) => {
  await redis.set(username, encryptedRefreshToken);
  return (true);
};

const update = async (username, newEncryptedRefreshToken) => {
  await redis.set(username, newEncryptedRefreshToken);
  return (true);
};

module.exports = { find, add, update };
