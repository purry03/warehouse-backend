const config = require("../config");

const models = require("../models");
const services = require("../services");

const crypto = require("crypto");


const book = async (user, listingId, quantity) => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!(listingId && quantity)) {
                resolve({
                    status: 400
                });
                return;
            }

            const prebookingNumber = crypto.randomBytes(2).toString("hex").toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();

            const newBooking = await models.prebookings.add(user, listingId, quantity, prebookingNumber);

            if (newBooking.err) {
                resolve({
                    status: 400,
                    body: { err: newBooking.err }
                });
            }
            else {
                resolve({
                    status: 200,
                    body: newBooking
                });
            }
        }
        catch (err) {
            console.log(err);
            reject({
                status: 200,
                body: { err }
            });
        }

    })

};


const cancel = async (prebookingNumber) => {

    return new Promise(async (resolve, reject) => {

        try {
            const cancelledPrebooking = await models.prebookings.remove(prebookingNumber);


            if (cancelledPrebooking.err) {
                resolve({
                    status: 400,
                    body: { err: cancelledPrebooking.err }
                });
            }
            else {
                resolve({
                    status: 200,
                });
            }
        }
        catch (err) {
            reject({
                status: 500,
                body: { err }
            });
        }

    });

};


const approve = async (prebookingNumber) => {

    return new Promise(async (resolve, reject) => {

        try {
            const approvedPrebooking = await models.prebookings.approve(prebookingNumber);


            if (approvedPrebooking.err) {
                resolve({
                    status: 400,
                    body: { err: approvedPrebooking.err }
                });
            }
            else {
                resolve({
                    status: 200,
                });
            }
        }
        catch (err) {
            reject({
                status: 500,
                body: { err }
            });
        }

    });

};


const get = async (prebooking_number) => {

    return new Promise(async (resolve, reject) => {

        try {


            const prebooking = await models.prebookings.get(prebooking_number);

            if (prebooking.err) {
                resolve({
                    status: 400,
                    body: { err: prebooking.err }
                });
            }
            else {
                resolve({
                    status: 200,
                    body: prebooking
                });
            }
        }
        catch (err) {
            console.log(err);
            reject({
                status: 200,
                body: { err }
            });
        }

    })

};



module.exports = { book, cancel, approve, get };