const mongoose = require('mongoose');

const connectDb = async () => {
    console.log("Starting the connection to db");
    await mongoose.connect(
        "mongodb://localhost:27017/hangman"
    );
    console.log("Test message after awaiting connection to db");
}

module.exports = connectDb;