import * as crypto from 'crypto';
import {
  Context
} from 'koa';

import models from '../models';

const book = async (ctx: Context): Promise < void > => {
  try {

    const [listingID, quantity] = [ctx.request.body.listing_id, ctx.request.body.quantity];
    const user = ctx.user;

    if (ctx.user.type !== 'buyer') {
      ctx.status = 401;
      ctx.body = {
        err: 'action not allowed for this account type'
      };
      return;
    }

    if (!(listingID && quantity)) {
      ctx.status = 400;
      return;
    }

    const prebookingNumber = `${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const newBooking = await models.prebookings.add(user, listingID, quantity, prebookingNumber);

    ctx.status = 200;
    ctx.body = newBooking;
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const cancel = async (ctx: Context): Promise < void > => {
  try {
    const prebookingNumber: string = ctx.request.body.prebooking_number;
    await models.prebookings.remove(prebookingNumber);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const approve = async (ctx: Context): Promise < void > => {
  try {

    const prebookingNumber: string = ctx.request.body.prebooking_number;

    await models.prebookings.approve(prebookingNumber);

    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const get = async (ctx: Context): Promise < void > => {
  try {

    const prebookingNumber: string = ctx.request.body.prebooking_number;

    const prebooking = await models.prebookings.get(prebookingNumber);

    ctx.status = 200;
    ctx.body = prebooking;

  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

export default {
  book,
  cancel,
  approve,
  get,
};