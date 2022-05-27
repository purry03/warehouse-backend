const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

const models = require('../models');
const services = require('../services');

const register = async (username: string, password: string, type: string) => {
  try {
    const saltRounds = 10;

    const passwordHash = bcrypt.hashSync(password, saltRounds);

    await models.users.create(username, passwordHash, type);
    return ({ status: 200 });
  } catch (err) {
    throw ({ status: 500, body: err.toString() });
  }
};

const login = async (username:string, password:string) => {
  try {
    const user = await models.users.findByUsername(username);

    if (!user) {
      return ({ status: 401, body: 'incorrrect credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (isValid) {
      const currentTime = new Date();

      const accessToken = jwt.sign({ createdAt: currentTime, username: user.username, userType: user.type }, config.SECRET, { expiresIn: '1h' });
      const refreshToken = crypto.randomBytes(8).toString('hex');
      const encryptedRefreshToken = services.crypto.encrypt(refreshToken);

      await models.tokens.add(username, encryptedRefreshToken, currentTime);

      return ({
        status: 200,
        body: {
          username,
          type: user.type,
          access_token: accessToken,
          token_type: 'jwt',
          expires_in: 3600,
          refresh_token: refreshToken,
        },
      });
    }
    return ({
      status: 401,
      body: { err: 'incorrect credentials' },
    });
  } catch (err) {
    console.log(err);

    throw ({
      status: 500,
      body: err.toString(),
    });
  }
};

export { register, login };
