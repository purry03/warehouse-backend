import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import config from '../config';

import models from '../models';
import services from '../services';
import {
  Context
} from 'koa';


const register = async (ctx: Context): Promise < void > => {
  try {
    const {
      username,
      password,
      type
    } = < ReqRegister > ctx.request.body;

    if (!username || !password || !type) {
      ctx.status = 400;
      return;
    }

    const saltRounds = 10;

    const passwordHash: string = bcrypt.hashSync(password, saltRounds);

    await models.users.create(username, passwordHash, type);
    ctx.status = 200
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.toString();
  }
};

const login = async (ctx: Context): Promise < void > => {
  try {
    const {
      username,
      password
    } = < ReqLogin > ctx.request.body;

    const user = await models.users.findByUsername(username);

    if (!user) {
      ctx.status = 401;
      ctx.body = {
        err: 'incorrect credentials'
      }
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (isValid) {
      const currentTime = new Date();

      const accessToken = jwt.sign({
        createdAt: currentTime,
        username: user.username,
        userType: user.type
      }, config.SECRET, {
        expiresIn: '1h'
      });
      const refreshToken = crypto.randomBytes(8).toString('hex');
      const encryptedRefreshToken = services.crypto.encrypt(refreshToken);

      await models.tokens.add(username, encryptedRefreshToken);

      ctx.status = 200;
      ctx.body = {
        username,
        type: user.type,
        access_token: accessToken,
        token_type: 'jwt',
        expires_in: 3600,
        refresh_token: refreshToken,
      }

      return;
    }
    ctx.status = 401;
    ctx.body = {
      err: 'incorrect credentials'
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

export default {
  register,
  login
};