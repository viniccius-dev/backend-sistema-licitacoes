const { Router } = require("express");

const domainsRoutes = Router();

const DomainsController = require("../controllers/DomainsController");

const domainsController = new DomainsController();

domainsRoutes.post("/", domainsController.create);

module.exports = domainsRoutes;