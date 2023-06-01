const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();

const corsOption = {
  origin: "*",
};

//connect database
const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

db.mongoose
  .connect(db.url, mongooseConfig)
  .then(() => console.log("database connected"))
  .catch((err) => {
    console.log(`failed connect ${err.message}`);
    process.exit();
  });

//register cors middleware
app.use(cors(corsOption));
app.use(express.json());

//call routes
require("./app/routes/user.route")(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
