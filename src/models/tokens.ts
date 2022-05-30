import database from '../database';

const find = async (username: string):Promise<string> => {
  const refreshToken = await database.redis.get(username);
  return (refreshToken);
};

const add = async (username: string, encryptedRefreshToken:string):Promise<boolean> => {
  await database.redis.set(username, encryptedRefreshToken);
  return (true);
};

const update = async (username: string, newEncryptedRefreshToken:string):Promise<boolean> => {
  await database.redis.set(username, newEncryptedRefreshToken);
  return (true);
};

export default { find, add, update };
