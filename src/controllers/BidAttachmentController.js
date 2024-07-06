const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class BidAttachmentController {

    async create(request, response) {
        const { bid_id } = request.params;
        const urls_links = request.body.urls_links ? JSON.parse(request.body.urls_links) : [];

        const uploads = [...urls_links, ...request.files];
        const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
    
        const diskStorage = new DiskStorage();
    
        const bid = await knex("bids").where({ id: bid_id }).first();

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
                bid_id
            }
        }));

        // Remover valores nulos
        const filteredAttachments = attachmentsCreate.filter(attachment => attachment !== undefined);

        await knex("attachments").insert(filteredAttachments);

        return response.json({ message: "Anexo cadastrado com sucesso. "});
    }
};

module.exports = BidAttachmentController;