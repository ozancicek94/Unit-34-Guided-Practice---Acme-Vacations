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
  departure_date DATE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  place_id UUID REFERENCES places(id) NOT NULL
  );
  `;

  await client.query(SQL);

};

//create methods to create users and places

const createUser = async({name}) => {

  const SQL = `
  INSERT INTO users(id, name) VALUES ($1, $2) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), name]);

  return response.rows[0];
};

const createPlace =async ({name}) => {

  const SQL = `
  INSERT INTO places (id, name) VALUES ($1, $2) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), name]);

  return response.rows[0];
};

// create fetchUsers and fetchPlaces method

const fetchUsers = async() => {

  const SQL = `
  SELECT * FROM users
  `;

  const response = await client.query(SQL);
  
  return response.rows;

};

const fetchPlaces = async() => {

  const SQL = `
  SELECT * FROM places
  `;

  const response = await client.query(SQL);

  return response.rows;

};

//create the createVacation and fetchVacations methods

const createVacation  =  async({user_id, place_id, departure_date}) => {

  const SQL = `
  INSERT INTO vacations(id, user_id, place_id, departure_date) VALUES ($1, $2, $3, $4)
  RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), user_id, place_id, departure_date]);

  return response.rows[0];

};

const fetchVacations = async() => {

  const SQL = `SELECT * FROM vacations`;

  const response = await client.query(SQL);

  return response.rows

};

// create destroyVacation method

const destroyVacation = async({id, user_id}) => {

  console.log(id, user_id)

  const SQL = `
  DELETE FROM vacations
  WHERE id=$1 AND user_id=$2
  `;

  await client.query(SQL, [id, user_id]);

};

//export the modules

module.exports = {
  client,
  createTables,
  createUser, 
  createPlace, 
  createVacation,
  fetchUsers, 
  fetchPlaces, 
  fetchVacations,
  destroyVacation
};



