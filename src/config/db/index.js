require('dotenv').config();

module.exports = function connectMongodb() {
//Reference library
var MongoClient = require('mongodb').MongoClient;
//Connection link
var url = process.env.MONGO_URL;
//Create object and pass data via url
var mongo = new MongoClient(url, {useNewUrlParser: true});

//Connect to Database.
mongo.connect((err)=>{
    if(err) throw err;
    console.log("Connect success!");
});
}
