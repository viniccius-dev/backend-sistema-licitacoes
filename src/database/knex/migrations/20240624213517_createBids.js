exports.up = knex => knex.schema.createTable("bids", table => {
    table.increments("id");
    table.text("bidding_modality").notNullable();
    table.text("bidding_process_number").notNullable();
    table.text("modality_process_number").notNullable();
    table.text("status").notNullable();
    table.text("object").notNullable();
    table.text("observations").notNullable();
    table.timestamp("realized_at").notNullable();

    table.integer("domain_id").references("id").inTable("domains");
});

exports.down = knex => knex.schema.dropTable("bids");