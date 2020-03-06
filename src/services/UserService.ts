import {User} from '../db';
import {Injectable} from "../decorators";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable
class UserService {

    constructor() {
        console.log('Hello from UserService');
    }

    public static async authorize(token: string) {
        const data = jwt.verify(token, process.env.JWT_KEY);
        try {
            // @ts-ignore
            const user = await User.findOne(data.id);
            if (!user) {
                throw new Error('Not authorized to access this resource');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async getUsers(filter?: any) {
        return await User.find();
    }

    public async getUser(filter: any) {
        return await User.findOne(filter);
    }

    public async createUser(data: any) {
        data.password = await bcrypt.hash(data.password, 8);
        const user = await User.create(data);
        // @ts-ignore
        const {password, ...result} = await User.save(user);

        return result;
    }

    public async updateUser(id: number, data: any) {
        const user = await User.findOne(id);
        User.merge(user, data);
        return await User.save(user);
    }

    public async deleteUser(id: number) {
        return await User.delete(id);
    }

    public async generateAuthToken(user: any) {
        return jwt.sign({id: user.id}, process.env.JWT_KEY);
    }

    public async findByCredentials(username: string, pass: string) {
        const user = await User.findOne({username});
        if (!user) {
            throw new Error('Invalid login credentials')
        }
        const isPasswordMatch = await bcrypt.compare(pass, user.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid login credentials');
        }
        const {password, ...userData} = user;

        return userData;
    }
}

export default UserService;
