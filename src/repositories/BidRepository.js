const knex = require("../database/knex");

class BidRepository {
    async findById(id) {
        const bid = await knex("bids").where({ id }).first();

        return bid;
    };

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
    };

    async update(bid) {
        const bidUpdated = await knex("bids").update(bid).where({ id: bid.id });

        return bidUpdated;
    };

    async delete(id) {
        return await knex("bids").where({ id }).delete();
    };
};

module.exports = BidRepository;