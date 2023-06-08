const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

async function connectToDatabase() {
  try {
    const connectionString = `mongodb://localhost:27017/moodsync_backend&replicaSet=rs0`;
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
