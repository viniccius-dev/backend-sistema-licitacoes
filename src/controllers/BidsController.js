const BidRepository = require("../repositories/BidRepository");
const BidsService = require("../services/BidsService");

class BidsController {
    async create(request, response) {
        const {
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at,
            domain_id
        } = request.body;
        const { role } = request.user;
        const domainId = role !== "admin" ? request.user.domain_id : domain_id;

        const bidRepository = new BidRepository();
        const bidsService = new BidsService(bidRepository);
        await bidsService.bidCreate({
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at,
            domain_id: domainId
        });

        return response.status(201).json({ message: "Licitação cadastrada com sucesso."});
    };

    async update(request, response) {
        const {
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at
        } = request.body;
        const { bid_id } = request.params;

        const bidRepository = new BidRepository();
        const bidsService = new BidsService(bidRepository);
        await bidsService.bidUpdate({
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at,
            bid_id
        });

        return response.json({ message: "Licitação atualizada com sucesso." });
    }

    async delete(request, response) {
        const { bid_id } = request.params;

        const bidRepository = new BidRepository();
        const bidsService = new BidsService(bidRepository);
        await bidsService.bidDelete(bid_id);

        return response.json({ message: "Licitação deletada com sucesso!" });
    }
};

module.exports = BidsController;