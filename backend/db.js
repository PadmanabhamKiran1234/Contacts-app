const mongoose = require('mongoose')

const mongoURI = "mongodb://127.0.0.1:27017/Contacts"

const connectToMongo = ()=> {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI , ()=>{
        console.log("Connected to Mongo");
    })
}

module.exports = connectToMongo;