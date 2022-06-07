import * as request from 'supertest'
import {
    jest
} from '@jest/globals'
import {
    createMockContext
} from '@shopify/jest-koa-mocks';

import {
    Context
} from 'koa';

import user from "./users";
import listings from "./listings";
import prebooking from "./prebookings";

import services from "../services";
import models from '../models';
import redis from '../database/redis';
import pg from '../database/postgres';


models.users.create = async (username: string, passwordHash: string, type: string): Promise < boolean > => {
    return true
}


models.users.findByUsername = async (username: string): Promise < DbUser > => {
    return {
        user_id: "1",
        username: "perry1715",
        password: "123",
        type: "seller"
    }
}

models.listings.add = async (userID: string, filename: string, title: string, description: string, inventory: number, price: number): Promise < boolean > => {
    return true;
}


models.listings.findByUsername = async (username: string): Promise < DbListing[] > => {
    return [];
}


models.prebookings.get = async (prebookingNumber: string): Promise < Prebooking > => {
    return {
        username: '',
        quantity: 0,
        productTitle: '',
        productPrice: 0
    };
}

models.prebookings.approve = async (prebookingNumber: string): Promise < boolean > => {
    return true;
}



describe('controllers', () => {

    let ctx: Context = createMockContext();

    beforeEach(() => {
        ctx = createMockContext();
    })

    afterAll(() => {
        redis.closeInstance();
        pg.end();
    })

    describe('controllers/users', () => {


        test("should save the username and password to the database", async () => {
            const bodyData = [{
                    username: "username1",
                    password: "password1",
                    type: "seller"
                },
                {
                    username: "username2",
                    password: "password2",
                    type: "buyer"
                },
                {
                    username: "username3",
                    password: "password3",
                    type: "seller"
                },
            ]
            for (const body of bodyData) {
                ctx.request.body = body;
                await user.register(ctx);
                expect(ctx.status).toBe(200);
            }
        })


        test("should return error for malformed input", async () => {
            const bodyData = [{
                    username: "username1",
                    password: "password1"
                },
                {
                    username: "username2",
                    type: "buyer"
                },
                {
                    password: "password3",
                    type: "seller"
                },
            ]
            for (const body of bodyData) {
                ctx.request.body = body;
                await user.register(ctx);
                expect(ctx.status).toBe(400);
            }
        })

    });

    describe("controllers/listings", () => {

        test("should return all listings", async () => {
            await listings.getAll(ctx);
            expect(ctx.status).toBe(200);
        });

        test("should return all listings matching the search query", async () => {
            const queryData = ["product1", "product2"];

            for (const query of queryData) {
                ctx.params = {}
                ctx.params["query"] = query;
                await listings.search(ctx);
                expect(ctx.status).toBe(200);
            }
        });

        test("should return error for missing search query", async () => {
            await listings.search(ctx);
            expect(ctx.status).toBe(400);
        });

        test("should return all listings for the given user", async () => {
            const queryData = ["user1", "user2"];

            for (const query of queryData) {
                ctx.params = {}
                ctx.params["username"] = query;
                await listings.getByUsername(ctx);
                expect(ctx.status).toBe(200);
            }
        });

        test("should return error for missing username", async () => {
            await listings.getByUsername(ctx);
            expect(ctx.status).toBe(400);
        });


    });

    describe("controllers/prebooking", () => {

        test("should return prebooking details", async () => {
            const bodyData = [{
                prebookingNumber: "a"
            }, {
                prebookingNumber: "b"
            }]
            for (const body of bodyData) {
                ctx.request.body = body;
                await prebooking.get(ctx);
                expect(ctx.status).toBe(200);
            }
        });

        test("should approve a prebooking", async () => {
            const bodyData = [{
                prebookingNumber: "a"
            }, {
                prebookingNumber: "b"
            }]
            for (const body of bodyData) {
                ctx.request.body = body;
                await prebooking.approve(ctx);
                expect(ctx.status).toBe(200);
            }
        });

        test("should return error for missing prebooking number", async () => {
            await prebooking.get(ctx);
            expect(ctx.status).toBe(400);
        });

    });

});