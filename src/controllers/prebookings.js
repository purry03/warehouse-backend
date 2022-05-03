const config = require("../config");

const database = require("../database");
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

            const newBooking = await database.prebookings.add(user, listingId, quantity, prebookingNumber);

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


const cancel = async (user, prebookingNumber) => {

    return new Promise(async (resolve, reject) => {

        try {
            const cancelledPrebooking = await database.prebookings.remove(user, prebookingNumber);


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

module.exports = { book, cancel };