const knex = require("../database/knex");

class BidRepository {
    async findByIdAndDomain({ bid_id, domain_id }) {
        const query = knex("bids").where({ id: bid_id }).first();

        if(domain_id) {
            query.where({ domain_id });
        }
      
        try {
          const bid = await query;
          return bid;
        } catch (err) {
          console.error(err);
          throw err;
        }
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

    async getBids(domain_id) {
        const query = knex("bids").select(
          'id',
          'bidding_modality',
          'bidding_process_number',
          'modality_process_number',
          'status',
          'object',
          'observations',
          'realized_at',
          'domain_id',
          knex.raw("CAST(SUBSTR(bidding_process_number, 1, INSTR(bidding_process_number, '/') - 1) AS INTEGER) as bidding_process_id"),
          knex.raw("CAST(SUBSTR(bidding_process_number, INSTR(bidding_process_number, '/') + 1) AS INTEGER) as bidding_process_year")
        )
        .orderBy("bidding_process_year", "desc")
        .orderBy("bidding_process_id", "desc");
      
        if (domain_id) {
          query.where({ domain_id });
        }
      
        try {
          const bids = await query;
          return bids;
        } catch (err) {
          console.error(err);
          throw err;
        }
    };

    async findAttachmentById(id) {
      const attachment = await knex("attachments").where({ id }).first();

      return attachment;
    };

    async createAttachments(filteredAttachments) {
      const attachments = await knex("attachments").insert(filteredAttachments);

      return attachments;
    }

    async deleteAttachments(id) {
      return await knex("attachments").where({ id }).delete();
    }
};

module.exports = BidRepository;