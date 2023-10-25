const { Router } = require("express");
const router = Router();

const { getUsers, createUser, loginUser } = require("../controllers/index.controller");

router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);

module.exports = router;
