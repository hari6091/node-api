const express = require("express");
const {
  createDatabase,
  createTable,
  addUser,
} = require("./controllers/index.controller");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require("./routes/index"));

app.get("/", (req, res) => {
  console.log("index");
});

app.listen(5000, async () => {
  await createDatabase();
  await createTable();
  await addUser();

  console.log("Server is listening on port 5000");
});
