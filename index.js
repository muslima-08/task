const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config();

const authRouter = require('./src/router/authRouter')
const dashRouter = require('./src/router/daashRouter')
const mainRouter = require('./src/router/mainRouter')

const app = express();
const PORT = process.env.PORT || 4001;

app.use(session({ secret: "secret_key", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static('public'))

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.render('index')
// })

app.use('/', authRouter)
app.use('/', dashRouter)
app.use('/', mainRouter)

app.get('*', (req, res) => {
  // res.status(404).send('Not Found')
  res.status(404).render('404')
})

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()




