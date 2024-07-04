const { Router } = require("express");

const bidsRoutes = Router();

const BidsController = require("../controllers/BidsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const bidsController = new BidsController();

bidsRoutes.use(ensureAuthenticated);

bidsRoutes.post("/", bidsController.create);
bidsRoutes.put("/:bid_id", bidsController.update);
bidsRoutes.delete("/:bid_id", bidsController.delete);
bidsRoutes.get("/", bidsController.index);
bidsRoutes.get("/:bid_id", bidsController.show);

module.exports = bidsRoutes;