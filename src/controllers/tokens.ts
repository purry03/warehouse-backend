import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import {
  Context
} from 'koa';

import models from '../models';
import services from '../services';

const refresh = async (ctx: Context): Promise < void > => {
  try {

    const [username, refreshToken] = [ctx.request.body.username, ctx.request.body.refresh_token];

    const dbToken: string = await services.crypto.decrypt(await models.tokens.find(username));

    if (!dbToken) {
      ctx.status = 401
      ctx.body = {
        err: 'invalid refresh token'
      }
      return;
    }

    if (dbToken !== refreshToken) {
      ctx.status = 401
      ctx.body = {
        err: 'invalid refresh token'
      }
      return;
    }

    const user = await models.users.findByUsername(username);

    const currentTime = new Date();
    const accessToken: string = jwt.sign({
      createdAt: currentTime,
      username: user.username,
      userType: user.type
    }, process.env.SECRET, {
      expiresIn: '1h'
    });
    const newRefreshToken: string = crypto.randomBytes(8).toString('hex');
    const newEncryptedRefreshToken: string = services.crypto.encrypt(newRefreshToken);

    await models.tokens.update(username, newEncryptedRefreshToken);

    ctx.status = 200;
    ctx.body = {
      username: user.username,
      access_token: accessToken,
      token_type: 'jwt',
      expires_in: 3600,
      refresh_token: newRefreshToken,
    };


  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

export default {
  refresh
};