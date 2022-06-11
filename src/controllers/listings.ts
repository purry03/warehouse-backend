import {
  File
} from "koa-multer";

import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

import models from '../models';
import config from '../config';
import {
  Context
} from "koa";

const create = async (ctx: Context): Promise < void > => {
  try {
    const {
      title,
      description,
      price,
      inventory,
    } = < ReqAddListing > ctx.request.body;

    const user: User = ctx.user;
    const file: File = ctx.file;

    if (user.type !== 'seller') {
      ctx.status = 403;
      ctx.body = {
        err: 'action not allowed for this account type'
      };
    }

    // copy file to public folder
    fs.copyFileSync(path.resolve(file.path), path.resolve(__dirname, `../../public/${file.filename}.${mime.extension(file.mimetype)}`));

    // remove temp file from uploads dir
    fs.unlinkSync(path.resolve(file.path));

    // save to db
    const listingUser = await models.users.findByUsername(user.username);
    await models.listings.add(listingUser.user_id, `${file.filename}.${mime.extension(file.mimetype)}`, title, description, inventory, price);

    ctx.status = 200;
  } catch (err: any) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const remove = async (ctx: Context): Promise < void > => {
  try {
    const {
      id
    } = < ID > ctx.params;

    await models.listings.removeByID(id);
    ctx.status = 200;
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const search = async (ctx: Context): Promise < void > => {
  try {

    if(!ctx.params){
      ctx.status = 400;
      ctx.body = {err : 'missing query string'};
      return;
    }
    const {
      query
    } = < Query > ctx.params;

    if(!query){
      ctx.status = 400;
      ctx.body = {err : 'missing query string'};
      return;
    }

    const listings = await models.listings.find(query);
    ctx.status = 200;
    ctx.body = listings;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const getAll = async (ctx: Context): Promise < void > => {
  try {
    const listings = await models.listings.findAll();
    ctx.status = 200;
    ctx.body = listings;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const getByID = async (ctx: Context): Promise < void > => {
  try {
    const {
      id
    } = < ID > ctx.params;
    const listings = await models.listings.findByID(id);
    ctx.status = 200;
    ctx.body = listings;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

const getByUsername = async (ctx: Context): Promise < void > => {
  try {
    if(!ctx.params){
      ctx.status = 400;
      ctx.body = {err : 'missing username'};
      return;
    }
    const {
      username
    } = < Username > ctx.params;

    if(!username){
      ctx.status = 400;
      ctx.body = {err : 'missing username'};
      return;
    }
    const listings = await models.listings.findByUsername(username);
    ctx.status = 200;
    ctx.body = listings;
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      err: err.toString()
    };
  }
};

export default {
  create,
  remove,
  search,
  getAll,
  getByID,
  getByUsername,
};