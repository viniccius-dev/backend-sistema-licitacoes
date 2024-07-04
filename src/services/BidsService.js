const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");

const DomainRepository = require("../repositories/DomainRepository");
const AppError = require("../utils/AppError");
const { update } = require("../database/knex");

class BidsService {
    constructor(bidRepository) {
        this.bidRepository = bidRepository;
    }

    async bidCreate({
        bidding_modality,
        bidding_process_number,
        modality_process_number,
        status,
        object,
        observations,
        realized_at,
        domain_id
    }) {

        if(!bidding_modality || !bidding_process_number || !modality_process_number || !status || !object || !realized_at || !domain_id ) {
            throw new AppError("Favor inserir todas as informações");
        };

        const domainRepository = new DomainRepository();
        const domain = await domainRepository.findById(domain_id);

        if(!domain) {
            throw new AppError("Domínio não encontrado.", 404);
        };

        const bidCreate = await this.bidRepository
        .create({
            bidding_modality,
            bidding_process_number,
            modality_process_number,
            status,
            object,
            observations,
            realized_at,
            domain_id
        });

        return bidCreate;
    };

    async bidUpdate({
        bidding_modality,
        bidding_process_number,
        modality_process_number,
        status,
        object,
        observations,
        realized_at,
        bid_id
    }) {
        const bid = await this.bidRepository.findById(bid_id);

        if(!bid) {
            throw new AppError("Licitação não encontrada.", 404);
        };

        bid.bidding_modality = bidding_modality ?? bid.bidding_modality;
        bid.bidding_process_number = bidding_process_number ?? bid.bidding_process_number;
        bid.modality_process_number = modality_process_number ?? bid.modality_process_number;
        bid.status = status ?? bid.status;
        bid.object = object ?? bid.object;
        bid.observations = observations ?? bid.observations;
        bid.realized_at = realized_at ?? bid.realized_at;

        const updateAt = new Date();
        const zonedDate =  toZonedTime(updateAt, "UTC");
        bid.updated_at = format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone: "UTC" });

        const bidUpdated = await this.bidRepository.update(bid);

        return bidUpdated;
    }
};

module.exports = BidsService;