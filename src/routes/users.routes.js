const { Router } = require("express");

const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersController = new UsersController();

usersRoutes.use(ensureAuthenticated);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", usersController.update);
usersRoutes.delete("/", usersController.delete);

module.exports = usersRoutes;