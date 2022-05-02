const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./config/db/index.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// HTTP Logger
app.use(morgan('combined'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
