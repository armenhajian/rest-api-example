import {NextFunction, Request, Response} from 'express';
import {API, Delete, Get, Inject, Middleware, Post, Put} from '../decorators';
import {UserService} from '../services';

@API('users')
class User {

    @Inject('UserService')
    usersService: UserService;

    constructor() {
        console.log('Hello from User controller');
    }

    @Get('/')
    @Middleware('authorizeMiddleware')
    public async getUsers(req: Request, res: Response) {
        const users = await this.usersService.getUsers();
        return res.send(users);
    }

    @Get('/:id')
    @Middleware('authorizeMiddleware')
    public async getById(req: Request, res: Response) {
        const user = await this.usersService.getUser(parseInt(req.params.id));
        return res.send(user)
    }

    @Post('/')
    public async createUser(req: Request, res: Response) {
        const result = await this.usersService.createUser(req.body);
        return res.send(result);
    }

    @Put('/:id')
    @Middleware('authorizeMiddleware')
    public async updateUser(req: Request, res: Response) {
        const result = await this.usersService.updateUser(parseInt(req.params.id), req.body);
        return res.send(result);
    }

    @Delete('/:id')
    @Middleware('authorizeMiddleware')
    public async deleteUser(req: Request, res: Response) {
        const result = await this.usersService.deleteUser(parseInt(req.params.id));
        return res.send(result);
    }

    @Post('/login')
    public async login(req: Request, res: Response) {
        try {
            const {username, password} = req.body;
            const user = await this.usersService.findByCredentials(username, password);
            if (!user) {
                return res.status(401).send({error: 'Invalid credentials'})
            }
            const token = await this.usersService.generateAuthToken(user);

            res.send({user, token});
        } catch (error) {
            res.status(400).send(error.message)
        }

    }

    public static async authorizeMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const token = (req.header('Authorization') || '').replace('Bearer ', '');
            if (!token || token.length === 0) {
                throw Error('Authentication is required!');
            }
            // @ts-ignore
            req.currentUser = UserService.authorize(token);

            next();
        } catch (error) {
            res.status(401).send(error.message);
        }
    }
}

export default User;
