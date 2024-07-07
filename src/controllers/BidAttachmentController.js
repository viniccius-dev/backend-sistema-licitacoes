const BidRepository = require("../repositories/BidRepository");
const BidsService = require("../services/BidsService");
class BidAttachmentController {

    async create(request, response) {
        const { bid_id } = request.params;
        const { domain_id } = request.user;
        const urls_links = request.body.urls_links ? JSON.parse(request.body.urls_links) : [];

        const uploads = [...urls_links, ...request.files];

        const bidRepository = new BidRepository();
        const bidsService = new BidsService(bidRepository);
        await bidsService.attachmentsCreate({ bid_id, domain_id, uploads });

        return response.json({ message: "Anexo cadastrado com sucesso. "});
    };

    async delete(request, response) {
        const { domain_id } = request.user;
        const { attachments } = request.body;

        const bidRepository = new BidRepository();
        const bidsService = new BidsService(bidRepository);
        await bidsService.attachmentsDelete({ domain_id, attachments });

        return response.json({ message: "Anexo deletado com sucesso." });
    };
};

module.exports = BidAttachmentController;