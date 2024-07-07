const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");

const DomainRepository = require("../repositories/DomainRepository");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const { diskStorage } = require("multer");

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
        bid_id,
        domain_id
    }) {
        const bid = await this.bidRepository.findByIdAndDomain({ bid_id, domain_id });

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
    };

    async bidDelete({ bid_id, domain_id }) {
        const bid = await this.bidRepository.findByIdAndDomain({ bid_id, domain_id });

        if(!bid) {
            throw new AppError("Licitação não encontrada.", 404);
        };

        return await this.bidRepository.delete(bid.id);
    };

    async showBids(domain_id) {
        const bids = await this.bidRepository.getBids(domain_id);

        return bids;
    };

    async showBid({ bid_id, domain_id }) {
        const bid = await this.bidRepository.findByIdAndDomain({ bid_id, domain_id });

        if(!bid) {
            throw new AppError("Licitação não encontrada.", 404);
        };

        return bid;
    };

    async attachmentsCreate({ bid_id, domain_id, uploads }) {
        const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
    
        const diskStorage = new DiskStorage();
    
        const bid = await this.bidRepository.findByIdAndDomain({ bid_id, domain_id });

        if(!bid) {
            throw new AppError("Licitação vinculada não encontrada", 404);
        };

        const attachmentsCreate = await Promise.all(uploads.map(async upload => {
            const filename = upload?.filename || upload?.link_name;
            const type = upload?.filename ? "file" : "link";
            let attachment;
            let attachmentName;
    
            if(!filename || type === "link" && !upload.url_link ) {
                return;
            };
    
            // Verificar se a extensão é permitida
            if (type === "file") {
                const fileExtension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    return;
                }

                attachment = await diskStorage.saveFile(filename);

                // Remover a extensão do nome do arquivo para salvar no banco
                const nameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
                attachmentName = Buffer.from(nameWithoutExtension.split("-")[1], 'latin1').toString('utf-8');
            }

            return {
                name: type === "file" ? attachmentName : filename,
                type,
                attachment: type === "file" ? attachment : upload.url_link,
                bid_id,
                domain_id: bid.domain_id
            }
        }));

        // Remover valores nulos
        const filteredAttachments = attachmentsCreate.filter(attachment => attachment !== undefined);

        return await this.bidRepository.createAttachments(filteredAttachments);
    };

    async attachmentsDelete({ domain_id, attachments }) {
        const attachmentDelete = await Promise.all(attachments.map(async attachment => {
            const file = await this.bidRepository.findAttachmentById(attachment);

            if(!file || domain_id !== null && file?.domain_id !== domain_id) {
                return;
            };

            const diskStorage = new DiskStorage();

            if(file.type === "file") {
                await diskStorage.deleteFile(file.attachment);
            };

            await this.bidRepository.deleteAttachments(file.id);

            return file;
        }));

        return attachmentDelete;
    }
};

module.exports = BidsService;