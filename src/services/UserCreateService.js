const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        if( !name || !email || !password ) {
            throw new AppError("Favor inserir todas as informações");
        }

        const checkUserExist = await this.userRepository.findByEmail(email);

        if(checkUserExist.length > 0) {
            throw new AppError("Este e-mail já está em uso.");
        }

        const hashedPassword = await hash(password, 10);

        const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });

        return userCreated;
    }
}

module.exports = UserCreateService;