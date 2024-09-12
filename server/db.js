// import the packages 

const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_vacations_db");
const app = express();
const {v4: uuid} = require('uuid');

//create tables for vacations, users, and places

const createTables = async() => {

  let SQL = `

  DROP TABLE IF EXISTS vacations;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS places;

  CREATE TABLE users(
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
  );

  CREATE TABLE places(
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
  );

  CREATE TABLE vacations(
  id UUID PRIMARY KEY,
  depature_date DATE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  place_id UUID REFERENCES places(id) NOT NULL
  );
  `;

  await client.query(SQL);

};

//create methods to create users and places

const createUser = async(name) => {

  const SQL = `
  INSERT INTO users(id, name) VALUES ($1, $2) RETURNING *
  `;

  const response = await client.query(SQL, [uuid.v4(), name]);

  return response.rows[0];
};

const createPlace =async (name) => {

  const SQL = `
  INSERT INTO places (id, name) VALUES ($1, $2) RETURNING *
  `;

  const response = await client.query(SQL, [uuid.v4(), name]);

  return response.rows[0];
};



//export the modules

module.exports = {
  client
};





// let SQL = `
//   INSERT INTO users (name) VALUES ('Ozan Cicek');
//   INSERT INTO users (name) VALUES ('Mariana Curti');
//   INSERT INTO users (name) VALUES ('Luis Curti');
//   INSERT INTO users (name) VALUES ('Celdy Curti');
//   INSERT INTO users (name) VALUES ('Gui Curti');
//   INSERT INTO users (name) VALUES ('Hasan Cicek');
//   INSERT INTO users (name) VALUES ('Serpil Cicek');
//   INSERT INTO users (name) VALUES ('Elif Cicek');
//   INSERT INTO users (name) VALUES ('Simba Cicek');
//   INSERT INTO users (name) VALUES ('Chico Cicek');
//   `;

//   await client.query(SQL);
//   console.log("User data has been seeded");

// let SQL = `
//   INSERT INTO places (name) VALUES ('Datca');
//   INSERT INTO places (name) VALUES ('Chalkidiki');
//   INSERT INTO places (name) VALUES ('Miami');
//   INSERT INTO places (name) VALUES ('Rio de Janeiro');
//   INSERT INTO places (name) VALUES ('Istanbul');
//   INSERT INTO places (name) VALUES ('Cappadocia');
//   INSERT INTO places (name) VALUES ('Berlin');
//   INSERT INTO places (name) VALUES ('Amsterdam');
//   `;

//   await client.query(SQL);
//   console.log("Place data has been seeded");