const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

app.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = await User.create({ username, password: hashedPassword })
    console.log("successfully created user " + newUser.username)
    res.send("successfully created user " + newUser.username)
  }
  catch (e) {
    console.log(e)
    next(e)
  }
})


app.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const [foundUser] = await User.findAll({ where: { username: username } })
    if (!foundUser) {
      res.send("incorrect username or password");
    }
    const isUserFound = await bcrypt.compare(password, foundUser.password)
    if (isUserFound) {
      res.send("successfully logged in user " + foundUser.username)
    } else {
      res.send("incorrect username or password")
    }
  }
  catch (e) {
    console.log(e)
    next(e)
  }
})


// we export the app, not listening in here, so that we can run tests
module.exports = app;
