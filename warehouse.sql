CREATE DATABASE warehouse;

// \c into DATABASE

CREATE TYPE valid_types AS ENUM ('seller', 'buyer');


CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    type valid_types NOT NULL
);


CREATE TABLE tokens (
    token_id serial PRIMARY KEY,
    user_id int UNIQUE NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE listings (
    listing_id serial PRIMARY KEY,
    user_id int NOT NULL,
    img VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    inventory int NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE prebookings (
    prebooking_id serial PRIMARY KEY,
    prebooking_number VARCHAR(14) UNIQUE NOT NULL,
    listing_id int NOT NULL,
    user_id int NOT NULL,
    quantity int NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_listing FOREIGN KEY(listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);