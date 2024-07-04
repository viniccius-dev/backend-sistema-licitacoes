const knex = require("../database/knex");

class BidRepository {
    async create({
        bidding_modality,
        bidding_process_number,
        modality_process_number,
        status,
        object,
        observations,
        realized_at,
        domain_id
    }) {
        const [bidId] = await knex("bids").insert({ 
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at,
            domain_id
        });

        return { id: bidId };
    }
};

module.exports = BidRepository;