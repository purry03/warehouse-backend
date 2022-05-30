import { File } from "koa-multer";

import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

import models from '../models';
import config from '../config';

const create = async (user: User, file: File, title: string, description: string, price: number, inventory: number) => {
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
  } catch (err: any) {
    throw ({
      status: 500,
      body: err.toString(),
    });
  }
};

const remove = async (id:string) => {
  try {
    await models.listings.removeByID(id);
    return ({
      status: 200,
    });
  } catch (err: any) {
    throw ({
      status: 500,
      body: err.toString(),
    });
  }
};

const search = async (query: string) => {
  try {
    const listings = await models.listings.find(query);
    return ({ status: 200, body: listings });
  } catch (err) {
    throw({ status: 500, body: err.toString() });
  }
};

const getAll = async () => {
  try {
    const listings = await models.listings.findAll();
    return ({ status: 200, body: listings });
  } catch (err) {
    throw({ status: 500, body: err.toString() });
  }
};

const getByID = async (id:string):Promise<Response> => {
  try {
    const listings = await models.listings.findByID(id);
    return ({ status: 200, body: listings });
  } catch (err) {
    throw({ status: 500, body: err.toString() });
  }
};

const getByUsername = async (username:string) => {
  try {
    const listings = await models.listings.findByUsername(username);
    return ({ status: 200, body: listings });
  } catch (err) {
    throw({ status: 500, body: err.toString() });
  }
};

export default {
  create, remove, search, getAll, getByID, getByUsername,
};
