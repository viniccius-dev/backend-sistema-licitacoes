const knex = require("../database/knex");

class UserRepository {
    async findById(id) {
        const user = await knex("users").where({ id }).first();

        return user;
    }

    async findByEmail(email) {
        const user = await knex("users").where({ email }).first();

        return user;
    };

    async create({ name, email, password }) {
        const [userId] = await knex("users").insert({
            name,
            email,
            password
        });

        return { id: userId }
    };

    async update(user) {
        const userUpdated = await knex("users").update(user).where({ id: user.id });

        return userUpdated;
    }

    async delete(id) {
        return await knex("users").where({ id }).delete();
    }
};

module.exports = UserRepository;