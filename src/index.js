const express = require('express');
const morgan = require('morgan');

const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTTP Logger
app.use(morgan('combined'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
