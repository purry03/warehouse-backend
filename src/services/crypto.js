const crypto = require('crypto');
const config = require('../config');

const encrypt = (value) => {
  const key = config.SECRET;
  const cipher = crypto.createCipher('aes256', key);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

const decrypt = (encrypted) => {
  const key = config.SECRET;
  const decipher = crypto.createDecipher('aes256', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
