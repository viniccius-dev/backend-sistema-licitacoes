exports.up = knex => knex.schema.createTable("attachments", table => {
    table.increments("id");
    table.text("name");
    table
    .enum("type", ["file", "link"], { useNative: true, enumName: "type" })
    .notNullable();

    table.text("attachment");
    table.integer("bid_id").references("id").inTable("bids").onDelete("CASCADE").notNullable();
});

exports.down = knex => knex.schema.dropTable("attachments");