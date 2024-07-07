const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const bidsRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const BidsController = require("../controllers/BidsController");
const BidAttachmentController = require("../controllers/BidAttachmentController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const bidsController = new BidsController();
const bidAttachmentController = new BidAttachmentController(); 

bidsRoutes.use(ensureAuthenticated);

bidsRoutes.post("/attachments/:bid_id", upload.array("attachment"), bidAttachmentController.create);
bidsRoutes.delete("/attachments", bidAttachmentController.delete);

bidsRoutes.post("/", bidsController.create);
bidsRoutes.put("/:bid_id", bidsController.update);
bidsRoutes.delete("/:bid_id", bidsController.delete);
bidsRoutes.get("/", bidsController.index);
bidsRoutes.get("/:bid_id", bidsController.show);

module.exports = bidsRoutes;