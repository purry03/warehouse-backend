const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const services = require('../services');
const models = require('../models');

const refresh = async (username, refreshToken) => {
  try {
    const dbToken = await services.crypto.decrypt(await models.tokens.find(username));

    if (!dbToken) {
      return ({
        status: 401,
        body: { err: 'invalid refresh token' },
      });
    }

    if (dbToken !== refreshToken) {
      return ({
        status: 401,
        body: { err: 'invalid refresh token' },
      });
    }

    const user = await models.users.findByUsername(username);

    const currentTime = new Date();
    const accessToken = jwt.sign({ createdAt: currentTime, username: user.username, userType: user.type }, process.env.SECRET, { expiresIn: '1h' });
    const newRefreshToken = crypto.randomBytes(8).toString('hex');
    const newEncryptedRefreshToken = services.crypto.encrypt(newRefreshToken);

    await models.tokens.update(username, newEncryptedRefreshToken, currentTime);

    return ({
      status: 200,
      body: {
        username: user.username,
        access_token: accessToken,
        token_type: 'jwt',
        expires_in: 3600,
        refresh_token: newRefreshToken,
      },
    });
  } catch (err) {
    throw new Error({
      status: 500,
      body: { err },
    });
  }
};

module.exports = { refresh };
