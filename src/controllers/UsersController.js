const UserRepository = require("../repositories/UserRepository");
const { UserCreateService } = require("../services/UsersService");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);
        await userCreateService.execute({ name, email, password });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;


    }
};

module.exports = UsersController;