require('dotenv').config();

const mongoose = require('mongoose');

module.exports = function connectMongodb() {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log('Connect success!');
  } catch (err) {
    console.error(err);
  }
};
