const express = require('express');
const morgan = require('morgan');

const route = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/db/index.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// HTTP Logger
app.use(morgan('combined'));

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
