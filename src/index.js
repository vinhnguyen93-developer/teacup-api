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
const { connectMongodb } = require('./config/db/index.js');

const app = express();
const port = process.env.PORT || 3000;

let store = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collection: 'sessions',
});

require('./config/passport');
connectMongodb();

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
    store: store,
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
      formatDate: (date) => {
        if (date === undefined) {
          return '';
        } else {
          let today = new Date(`${date}`);
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          const yyyy = today.getFullYear();

          return (today = mm + ' Tháng ' + dd + ', ' + yyyy);
        }
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
      compareCategory: (categoryId, productCategoryId) => {
        if (categoryId === productCategoryId) {
          return 'selected';
        }
      },
      checkPaymentType: (paymentType) => {
        if (paymentType === undefined) {
          return '';
        } else if (paymentType === '1') {
          return 'Thanh toán khi nhận hàng';
        } else if (paymentType === '9');
        return 'Đã thanh toán online';
      },
      checkOrderStatus: (orderStatus) => {
        if (orderStatus === undefined) {
          return '';
        } else if (orderStatus === true) {
          return 'Đã thực hiện';
        } else {
          return 'Đang tiến hành';
        }
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
