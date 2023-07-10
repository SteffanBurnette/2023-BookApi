//Lets us set up an express app
//This is an express object
const express = require("express");

//Allows us to use express features
const app = express();
const port = 3000;
require('dotenv').config();
const { query } = require('./database');

app.use((req, res, next) => {
    //An event listener
    res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
    next();
  });
  // add this line
  app.use(express.json()) // this allows us to send JSON formatted bodies in our requests
/**This script does a few things:

It imports the Express.js module.
It creates an instance of an Express.js application.
It defines a route handler for GET requests made to the root of our application (http://localhost:5000/).
It starts our application on port 4000. */
//res is the response, req is the request

//CRUD with RESTApi Node.js Express.js
// List all books
//Gets all the books from the database with the sql commands
app.get("/books", async (req, res) => {
    try {
      const allBooks = await query("SELECT * FROM book_api");
  
      res.status(200).json(allBooks.rows);
    } catch (err) {
      console.error(err);
    }
  });

  // Get a specific book
app.get("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  //Since we are filtering by id we will only get on table at a time due to unique id's
    try {
      const book = await query("SELECT * FROM book_api WHERE id = $1", [bookId]);
  
      if (book.rows.length > 0) {
        res.status(200).json(book.rows[0]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      console.error(err);
    }
  });

  //CREATES the book from users input (body in this case) and Posts it to the database
app.post("/books", async (req, res) => {
    //Takes in the users input from their body
    const { title, author, price } = req.body;
  
    try {
      //Defining the inserts like this stop sql injection attacks.
      const newBook = await query(
        "INSERT INTO book_api (title, author, price) VALUES ($1, $2, $3) RETURNING *",
        [title, author, price]
      );
  
      res.status(201).json(newBook.rows[0]);
    } catch (err) {
      console.error(err);
    }
  });



  // Updates a specific book
  app.patch("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    const { title, author, price } = req.body;
  //The $'s indicates paramaters that will soon be passed in. The [] after are that values that
  //will be passed in, in sequnetial order
    try {
      const updatedBook = await query(
        "UPDATE book_api SET title = $1, author = $2, price = $3 WHERE id = $4 RETURNING *",
        [title, author, price, bookId]
      );
  
      if (updatedBook.rows.length > 0) {
        res.status(200).json(updatedBook.rows[0]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      console.error(err);
    }
  });


// Delete a specific book
app.delete("/books/:id", async (req, res) => {
    //Gets the current id parameter url.
    const bookId = parseInt(req.params.id, 10);
  //Finds what needs to be deleted by getting the id.
    try {
        //Deletes the column where the url parameter is located.
      const deleteOp = await query("DELETE FROM book_api WHERE id = $1", [bookId]);
  
      if (deleteOp.rowCount > 0) {
        res.status(200).send({ message: "Book deleted successfully" });
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      console.error(err);
    }
  });
  //NOTE: The database will only every assign a unique id once and will not reassign that
  //id value again even if the column its associated with is deleted.



  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})