const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/db/index.js');

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

connectDB();

// HTTP Logger
app.use(morgan('combined'));

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
