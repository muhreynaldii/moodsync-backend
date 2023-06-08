const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

async function connectToDatabase() {
  try {
    const connectionString = `mongodb+srv://reynaldi:moodsync@cluster0.genin59.mongodb.net/?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to database");
  } catch (err) {
    console.log(`failed connect ${err.message}`);
    process.exit();
  }
}

module.exports = connectToDatabase;
