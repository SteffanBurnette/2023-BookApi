//Establishes a connection to the database
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});


//Use backticks to code in sql:
//Creates the table to be used
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS book_api(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    price INTEGER
  );
`;


const createTable = async () => {
      //We then create a function createTable that will execute the query.
  //pool.query() returns a promise for the result of
  //exectuing the SQL query and will raise an error if something goes wrong.
    try {
      await pool.query(createTableQuery);
      console.log('Table created successfully');
    } catch (err) {
      console.error('Error executing query', err.stack);
    };
  };
  

  //Invokes the createTable function
  createTable();




//Finally, we want to export a query function that will allow us to trigger 
//SQL queries from other files in our codebase.
  module.exports = {
    query: (text, params, callback) => {
      console.log("QUERY:", text, params || "");
      return pool.query(text, params, callback);
    },
  };