const crypto = require('crypto');

const models = require('../models');

const book = async (user, listingId, quantity) => {
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
  } catch (err) {
    console.log(err);
    throw new Error({
      status: 200,
      body: { err },
    });
  }
};

const cancel = async (prebookingNumber) => {
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
    throw new Error({
      status: 500,
      body: { err },
    });
  }
};

const approve = async (prebookingNumber) => {
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
    throw new Error({
      status: 500,
      body: { err },
    });
  }
};

const get = async (prebookingNumber) => {
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
    console.log(err);
    throw new Error({
      status: 200,
      body: { err },
    });
  }
};

module.exports = {
  book, cancel, approve, get,
};
