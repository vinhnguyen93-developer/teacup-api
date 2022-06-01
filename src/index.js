const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const path = require('path');

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/db/index.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

connectDB();

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
        return money.toLocaleString('it-IT', { style: 'currency', currency: 'vnd' });
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
