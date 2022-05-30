import { Context,Next } from "koa";

import * as jwt from 'jsonwebtoken';

async function checkAuth(ctx: Context, next: Next) {
  // check if header exists
  if (!ctx.headers.authorization) {
    ctx.status = 400;
    ctx.body = { err: 'authorization header missing' };
    return;
  }

  const headerData = ctx.headers.authorization.split(' ');

  if (headerData.length === 2) {
    const token:string = headerData[1];

    let decoded;

    try {
      decoded = <JwtData>await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      ctx.status = 400;
      ctx.body = { err: err.message };
      return;
    }

    ctx.user = { username: decoded.username, type: decoded.userType };

    await next();
  } else {
    ctx.status = 400;
    ctx.body = { err: 'malformed auth headers' };
  }
}

export default {checkAuth}