import {Request, Response} from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import userRepository from "../repositories/user.repository";

export default class UserController {
    async registerUser(req: Request, res: Response) {
        if (!req.body.email || !req.body.username || !req.body.password) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        try {
            const {email, username, password} = req.body;
            let userExists = await userRepository.findByEmail(email);
            if (userExists) {
                return res
                    .status(400)
                    .json({error: "User with this email already exists"});
            }

            userExists = await userRepository.findByUsername(username);
            if (userExists) {
                return res
                    .status(400)
                    .json({error: "User with this username already exists"});
            }

            // generate password hash
            const hashedPassword = await bcrypt.hash(password, 12);
            //save user
            const user = new User({
                email: email,
                username: username,
                password: hashedPassword
            });

            const savedUser = await userRepository.save(user);

            res.status(201).send({
                id: savedUser.id,
                email: savedUser.email,
                username: savedUser.username,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            });
        } catch (err) {
            res.status(500).send({
                error: "Some error occurred while retrieving Users."
            });
        }
    }

    async filterAllUsers(req: Request, res: Response) {
        const username = typeof req.query.username === "string" ? req.query.username : "";
        const email = typeof req.query.email === "string" ? req.query.email : "";

        try {
            const users = await userRepository.filterAll({username: username, email: email});
            let userArr: any[]= [];
            users.forEach((user) => {
                userArr.push({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                });
            });

            res.status(200).send(userArr);
        } catch (err) {
            res.status(500).send({
                error: "Some error occurred while retrieving users."
            });
        }
    }

    async userLogin(req: Request, res: Response) {
        const {email, password} = req.body;
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).json({error: "Invalid email or password."});
            }

            const validPassword = await bcrypt.compare(
                password,
                user.password || ""
            );

            if (!validPassword) {
                return res.status(401).json({error: "Invalid email or password."});
            }

            const token = jwt.sign({userId: user.dataValues.id}, (process.env.JWT_SECRET as Secret), {
                expiresIn: "1w", // token will be valid for 1 week
            });
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('token', token)
            if (user) res.status(200).send({
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (err) {
            res.status(500).send({
                message: `Error retrieving user with id=${email}.`
            });
        }
    }

    async getUserByID(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        try {
            const user = await userRepository.findByID(id);
            if (user) res.status(200).send({
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
            else
                res.status(404).send({
                    message: `Cannot find user with id=${id}.`
                });
        } catch (err) {
            res.status(500).send({
                message: `Error retrieving user with id=${id}.`
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        let {username, email} = req.body;
        const id: number = parseInt(req.params.id);
        try {
            let user = await userRepository.findByID(id);
            if (!user) {
                return res.status(404).json({error: `user with ${id} not found`});
            }

            user.username = username
            user.email = email
            const num = await userRepository.update(user);
            if (num == 0) {
                return res.status(400).json({error: "failed to update user"});
            }
            //get  the update user
            user = await userRepository.findByID(id);
            if (user) {
                res.status(200).send({
                    id: user?.id,
                    email: user?.email,
                    username: user?.username,
                    createdAt: user?.createdAt,
                    updatedAt: user?.updatedAt,
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        } catch (err) {
            res.status(500).send({
                message: `Error updating User with id=${id}.`
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        try {
            let user = await userRepository.findByID(id);
            if (!user) {
                return res.status(404).json({error: `user with ${id} not found`});
            }

            const num = await userRepository.delete(id);
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                });
            }
        } catch (err) {
            res.status(500).send({
                message: `Could not delete User with id==${id}.`
            });
        }
    }
}
