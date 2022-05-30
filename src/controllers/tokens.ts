import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import models from '../models';
import services from '../services';

const refresh = async (username: string, refreshToken: string) => {
  try {
    const dbToken:string = await services.crypto.decrypt(await models.tokens.find(username));

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
    const accessToken:string = jwt.sign({ createdAt: currentTime, username: user.username, userType: user.type }, process.env.SECRET, { expiresIn: '1h' });
    const newRefreshToken:string = crypto.randomBytes(8).toString('hex');
    const newEncryptedRefreshToken:string = services.crypto.encrypt(newRefreshToken);

    await models.tokens.update(username, newEncryptedRefreshToken);

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
    throw ({
      status: 500,
      body: err.toString(),
    });
  }
};

export default {refresh};