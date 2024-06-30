const { format,  } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    };

    async userCreate({ name, email, password, user_role }) {
        if(user_role !== 'admin') {
            throw new AppError("Não autorizado.", 401);
        };

        if( !name || !email || !password ) {
            throw new AppError("Favor inserir todas as informações");
        };

        const checkUserExist = await this.userRepository.findByEmail(email);

        if(checkUserExist) {
            throw new AppError("Este e-mail já está em uso.");
        };

        const hashedPassword = await hash(password, 10);

        const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });

        return userCreated;
    };

    async userUpdate({ name, email, password, old_password, user_id, user_role }) {
        //TO DO: Também ser possível atualizar o id de domínio 

        const user = await this.userRepository.findById(user_id);

        if(!user) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        user.name = name ?? user.name;

        if(email) {
            const userWithUpdateEmail = await this.userRepository.findByEmail(email);

            if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
                throw new AppError("Esse e-mail já está em uso. Por favor escolha outro.");
            };
        };

        if(email && user_role === 'admin' && user.role === 'admin') {
            if(!old_password) {
                throw new AppError("É necessário inserir a senha atual para atualizar o e-mail");
            };

            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword) {
                throw new AppError("A senha antiga inserida está incorreta");
            }
            user.email = email;
        } else {
            user.email = email ?? user.email;
        }

        if(user_role !== 'admin' || user_role === 'admin' && user.role === 'admin') {
            // TO DO: Quando for ADM não precisa identificar a senha antiga
            if(password && !old_password) {
                throw new AppError("É necessário inserir a senha antiga para definar uma nova.");
            };

            // TO DO: Quando for ADM não precisa identificar a senha antiga
            if(password && old_password) {
                const checkOldPassword = await compare(old_password, user.password);
    
                if(!checkOldPassword) {
                    throw new AppError("A senha antiga inserida está incorreta.");
                }
    
                user.password = await hash(password, 10);
            };

        } else {
            user.password = password ? await hash(password, 10) : user.password;
        };

        const updatedAt = new Date();
        const zonedDate = toZonedTime(updatedAt, 'UTC');
        user.updated_at = format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });

        const userUpdated = await this.userRepository.update(user);

        return userUpdated;
    };

    async userDelete({ id, user_role }) {
        const user = await this.userRepository.findById(id);

        if(user_role !== 'admin' || user_role === 'admin' && user.role === 'admin') {
            throw new AppError("Não autorizado.", 401);
        };

        if(!user) {
            throw new AppError("Usuário não encontrado.", 404);
        };
        
        return await this.userRepository.delete(id);
    };

    async showUsers({ user_role }) {
        if(user_role !== 'admin') {
            throw new AppError("Não autorizado", 401);
        };

        const users = await this.userRepository.getUsers();
        // users.forEach(user => delete user.password);

        return users;
    };

    async showUser({ id, user_role }) {
        if(user_role != 'admin') {
            throw new AppError("Não autorizado", 401);
        };

        const user = await this.userRepository.findById(id);

        if(!user) {
            throw new AppError("Usuário não encontrado.", 404);
        };

        delete user.password;

        return user;
    };
};

module.exports = UsersService;