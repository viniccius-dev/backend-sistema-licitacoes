const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const authConfig = require("../../configs/auth");
const AppError = require("../../utils/AppError");

class sessionsService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, password }) {
        if( !email || !password ) {
            throw new AppError("Favor inserir todas as informações");
        }

        const user = await this.userRepository.findByEmail(email);

        if(user.length < 0){
            throw new AppError("E-mail e/ou senha incorreta", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched) {
            throw new AppError("Email e/ou senha incorreta", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        });

        delete user.password;

        return { user, token };
    }
}

module.exports = sessionsService;