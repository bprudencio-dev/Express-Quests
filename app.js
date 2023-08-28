require('dotenv').config();
const express = require("express");
const port= process.env.APP_PORT;
const app = express();
app.use(express.json());


const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { hashPassword, verifyPassword, verifyToken } = require('./auth');
const usersHandlers = require('./usersHandlers');

//Public Routes
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/login", usersHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersId);
app.post("/api/users", hashPassword, usersHandlers.postUser)

//Protected routes
app.use(verifyToken);
app.post("/api/movies", verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);


app.put("/api/users/:id", hashPassword,  usersHandlers.updateUser)
app.delete("/api/users/:id", usersHandlers.deleteUser)

// const isItDwight = (req, res)=>{
//   if(req.body.email ===  "dwight@theoffice.com" && req.body.password === "123456"){
//     res.send('Credentials are valid');
//   }else {
//     res.status(401).send('Credentials are incorrect')
//   }
// };






app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
