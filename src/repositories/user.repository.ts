import {Op} from "sequelize";
import User from "../models/user.model";
import UserModel from "../models/user.model";

interface IUserRepository {
    save(user: User): Promise<User>;

    filterAll(searchParams: { username: string, email: string }): Promise<User[]>;

    findByID(userId: number): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    findByUsername(username: string): Promise<User | null>;

    update(user: User): Promise<Number>;

    delete(userId: number): Promise<number>;
}

interface SearchCondition {
    [key: string]: any;
}

class UserRepository implements IUserRepository {
    async save(user: User): Promise<User> {
        try {
            return await User.create({
                username: user.username,
                email: user.email,
                password: user.password
            });
        } catch (err) {
            throw new Error("Failed to create user");
        }
    }

    async filterAll(searchParams: { username?: string, email?: string }): Promise<User[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.username)
                condition.title = {[Op.iLike]: `%${searchParams.username}%`};

            if (searchParams?.email)
                condition.title = {[Op.iLike]: `%${searchParams.email}%`};

            return await UserModel.findAll({where: condition});
        } catch (error) {
            throw new Error("Failed to retrieve users!");
        }
    }

    async findByID(userId: number): Promise<User | null> {
        try {
            return await User.findByPk(userId);
        } catch (error) {
            throw new Error("Failed to retrieve user!");
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await User.findOne({where: {email: email}});
        } catch (error) {
            throw new Error("Failed to retrieve user!");
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            return await User.findOne({where: {username: username}});
        } catch (error) {
            throw new Error("Failed to retrieve user!");
        }
    }

    async update(user: User): Promise<Number> {
        const {id, username, email} = user;

        try {
            const affectedRows = await User.update({username: username, email: email},
                {where: {id: id}}
            );
            return affectedRows[0]
        } catch (error) {
            throw new Error("Failed to update User!");
        }
    }

    async delete(userId: number): Promise<number> {
        try {
            return await User.destroy({where: {id: userId}});
        } catch (error) {
            throw new Error("Failed to delete User!");
        }
    }
}

export default new UserRepository();
