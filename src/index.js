const cors = require("cors");
const express = require("express");
const {
  createDatabase,
  createTable,
  addUser,
} = require("./controllers/index.controller");
const app = express();

app.set("trust proxy", 1); 

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
    "Access-Control-Allow-Origin": "*",
  })
);

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
