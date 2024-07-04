const DomainRepository = require("../repositories/DomainRepository");
const AppError = require("../utils/AppError");

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
    }
};

module.exports = BidsService;