const express = require("express");
const routes = require("./routes");
const connectToDatabase = require("./database");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", routes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ error: err.message });
});

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = startServer;
