const { Router } = require("express");

const routes = Router();

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const domainsRouter = require("./domains.routes");
const bidsRouter = require("./bids.routes");

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/domains", domainsRouter);
routes.use("/bids", bidsRouter);

module.exports = routes;