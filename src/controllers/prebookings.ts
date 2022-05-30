import * as crypto from 'crypto';

import models from '../models';

const book = async (user: string, listingId: string, quantity: string) => {
  try {
    if (!(listingId && quantity)) {
      return ({
        status: 400,
      });
    }

    const prebookingNumber = `${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    try {
      const newBooking = await models.prebookings.add(user, listingId, quantity, prebookingNumber);

      return ({
        status: 200,
        body: newBooking,
      });
    } catch (err: any) {
      return ({
        status: 400,
        body: {
          err
        },
      });
    }


  } catch (err: any) {
    throw ({
      status: 200,
      body: err.toString(),
    });
  }
};

const cancel = async (prebookingNumber: string) => {
  try {
    await models.prebookings.remove(prebookingNumber);
    return ({
      status: 200,
    });
  } catch (err) {
    throw ({
      status: 500,
      body: err.toString(),
    });
  }
};

const approve = async (prebookingNumber: string):Promise<Response> => {
  try {
    await models.prebookings.approve(prebookingNumber);

    return ({
      status: 200,
    });
  } catch (err) {
    throw ({
      status: 200,
      body: err.toString(),
    });
  }
};

const get = async (prebookingNumber: string) => {
  try {
    const prebooking = await models.prebookings.get(prebookingNumber);

    return ({
      status: 200,
      body: prebooking,
    });
  } catch (err) {
    throw ({
      status: 500,
      body: {
        err
      },
    });
  }
};

export default {
  book,
  cancel,
  approve,
  get,
};