const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const models = require('../models');
const config = require('../config');

const create = async (user, file, title, description, price, inventory) => {
  try {
    if (user.type !== 'seller') {
      return ({
        status: 403,
        body: { err: 'action not allowed for this account type' },
      });
    }

    // copy file to public folder
    fs.copyFileSync(path.resolve(file.path), path.resolve(config.DIR, `./public/${file.filename}.${mime.extension(file.mimetype)}`));

    // remove temp file from uploads dir
    fs.unlinkSync(path.resolve(file.path));

    // save to db
    const listingUser = await models.users.findByUsername(user.username);
    await models.listings.add(listingUser.user_id, `${file.filename}.${mime.extension(file.mimetype)}`, title, description, inventory, price);

    return ({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    throw new Error({
      status: 500,
      body: { err },
    });
  }
};

const remove = async (id) => {
  try {
    await models.listings.removeByID(id);
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

const search = async (query) => {
  try {
    const listings = await models.listings.find(query);
    return ({ status: 200, body: listings });
  } catch (err) {
    console.log(err);
    throw new Error({ status: 500, body: err });
  }
};

const getAll = async () => {
  try {
    const listings = await models.listings.findAll();
    return ({ status: 200, body: listings });
  } catch (err) {
    console.log(err);
    throw new Error({ status: 500, body: err });
  }
};

const getByID = async (id) => {
  try {
    const listings = await models.listings.findByID(id);
    return ({ status: 200, body: listings });
  } catch (err) {
    console.log(err);
    throw new Error({ status: 500, body: err });
  }
};

const getByUsername = async (username) => {
  try {
    const listings = await models.listings.findByUsername(username);
    return ({ status: 200, body: listings });
  } catch (err) {
    console.log(err);
    throw new Error({ status: 500, body: err });
  }
};

module.exports = {
  create, remove, search, getAll, getByID, getByUsername,
};
