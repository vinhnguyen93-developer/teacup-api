require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const route = require('./routes');
const { checkUserLogin } = require('./app/middlewares/LoginMiddleware');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/db/index.js');

connectDB();
require('./config/passport');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 180 * 60 * 1000 },
  }),
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(checkUserLogin);

// HTTP Logger
app.use(morgan('combined'));

// Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      formatDate: (date) => {
        return date.toLocaleString();
      },
      formatMoneyVnd: (money) => {
        if (!money) {
          return '';
        }

        return money.toLocaleString('it-IT', { style: 'currency', currency: 'vnd' });
      },
      getCurrentUser: (user) => {
        return user.userName;
      },
      checkAdmin: (user) => {
        return user.isAdmin;
      },
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
