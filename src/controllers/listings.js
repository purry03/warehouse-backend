const config = require("../config");

const models = require("../models");
const services = require("../services");

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const create = async (user, file, title, description, price, inventory) => {
    return new Promise(async (resolve, reject) => {

        try {

            if (user.type != "seller") {
                resolve({
                    status: 403,
                    body: { err: "action not allowed for this account type" }
                });
                return;
            }

            //copy file to public folder
            fs.copyFileSync(path.resolve(file.path), path.resolve(`../public/${file.filename}.${mime.extension(file.mimetype)}`));

            //remove temp file from uploads dir
            fs.unlinkSync(path.resolve(file.path));

            //save to db
            const listingUser = await models.users.findByUsername(user.username);
            await models.listings.add(listingUser.user_id, file.filename + "." + mime.extension(file.mimetype), title, description, inventory, price);

            resolve({
                status: 200
            });

        }
        catch (err) {
            reject({
                status: 500,
                body: { err }
            });
        }

    });
};


module.exports = { create }