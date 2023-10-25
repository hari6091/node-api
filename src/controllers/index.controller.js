const { Pool } = require("pg");

const createDatabase = async () => {
  const poolWithoutDatabase = new Pool({
    user: "postgres",
    host: "172.23.0.2",
    password: "0038",
    database: "postgres",
    port: "5432",
  });

  try {
    const result = await poolWithoutDatabase.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      ["retronatus"]
    );

    if (result.rowCount === 0) {
      await poolWithoutDatabase.query("CREATE DATABASE retronatus");
      console.log("Database 'retronatus' created.");
    } else {
      console.log("Database 'retronatus' already exists.");
    }
  } catch (error) {
    console.error("Error creating or checking the database:", error);
  } finally {
    await poolWithoutDatabase.end();
  }
};

const pool = new Pool({
  user: "postgres",
  host: "172.23.0.2",
  password: "0038",
  database: "retronatus",
  port: "5432",
});

const createTable = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        name text,
        email text,
        password text
      );
    `);
};

const addUser = async () => {
  const name = "Admin";
  const email = "admin@gmail.com";
  const password = "qwe123";

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length === 0) {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    console.log("Usuário adicionado com sucesso.");
  } else {
    console.log("Usuário já existe.");
  }
};

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const response = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email]
  );
  res.json({
    message: "User Added successfully",
    body: {
      user: { name, email },
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userQuery = "SELECT * FROM users WHERE email = $1";
  const userResponse = await pool.query(userQuery, [email]);

  if (userResponse.rows.length === 0) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const user = userResponse.rows[0];

  if (user.password !== password) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  res.status(200).json({ message: "Login bem-sucedido" });
};

module.exports = {
  getUsers,
  createDatabase,
  createTable,
  addUser,
  createUser,
  loginUser,
};
