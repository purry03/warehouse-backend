const crypto = require('crypto');

const models = require('../models');

const book = async (user: Username, listingId: string, quantity:number) => {
  try {
    if (!(listingId && quantity)) {
      return ({
        status: 400,
      });
    }

    const prebookingNumber = `${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const newBooking = await models.prebookings.add(user, listingId, quantity, prebookingNumber);

    if (newBooking.err) {
      return ({
        status: 400,
        body: { err: newBooking.err },
      });
    }
    return ({
      status: 200,
      body: newBooking,
    });
  } catch (err: any) {
    throw ({
      status: 200,
      body: err.toString(),
    });
  }
};

const cancel = async (prebookingNumber: string) => {
  try {
    const cancelledPrebooking = await models.prebookings.remove(prebookingNumber);

    if (cancelledPrebooking.err) {
      return ({
        status: 400,
        body: { err: cancelledPrebooking.err },
      });
    }
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

const approve = async (prebookingNumber: string) => {
  try {
    const approvedPrebooking = await models.prebookings.approve(prebookingNumber);

    if (approvedPrebooking.err) {
      return ({
        status: 400,
        body: { err: approvedPrebooking.err },
      });
    }
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

    if (prebooking.err) {
      return ({
        status: 400,
        body: { err: prebooking.err },
      });
    }
    return ({
      status: 200,
      body: prebooking,
    });
  } catch (err) {
    throw ({
      status: 200,
      body: { err },
    });
  }
};

export {
  book, cancel, approve, get,
};
