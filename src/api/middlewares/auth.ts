import { Context } from "vm";

const jwt = require('jsonwebtoken');

async function checkAuth(ctx: Context, next: () => Promise<any>) {
  // check if header exists
  if (!ctx.headers.authorization) {
    ctx.status = 400;
    ctx.body = { err: 'authorization header missing' };
    return;
  }

  const headerData = ctx.headers.authorization.split(' ');

  if (headerData.length === 2) {
    const token = headerData[1];

    let decoded;

    try {
      decoded = await jwt.verify(token, process.env.SECRET);
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

module.exports = { checkAuth };
