const { Router } = require("express");

const domainsRoutes = Router();

const DomainsController = require("../controllers/DomainsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const domainsController = new DomainsController();

domainsRoutes.use(ensureAuthenticated);

domainsRoutes.post("/", verifyUserAuthorization(), domainsController.create);

module.exports = domainsRoutes;