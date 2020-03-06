import {NextFunction, Request, Response} from 'express';
import {API, Delete, Get, Inject, Middleware, Post as PostMethod, Put} from '../decorators';
import {PostService, UserService} from '../services';

@API('posts')
class Post {

    @Inject('PostService')
    postsService: PostService;

    constructor() {
        console.log('Hello from Post controller');
    }

    public static checkIfPermittedMiddleware(req: Request, res: Response, next: NextFunction) {
        console.log('Hello from posts middleware');

        next();
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

    @Get('/')
    @Middleware('authorizeMiddleware')
    public async getPosts(req: Request, res: Response) {
        const posts = await this.postsService.getPosts();
        return res.send(posts);
    }

    @Get('/:id')
    @Middleware('authorizeMiddleware')
    public async getById(req: Request, res: Response) {
        const post = await this.postsService.getPost(parseInt(req.params.id));
        return res.send(post)
    }

    @PostMethod('/')
    @Middleware('authorizeMiddleware')
    public async createPost(req: Request, res: Response) {
        // @ts-ignore
        const result = await this.postsService.createPost(req.body, req.currentUser.id);
        return res.send(result);
    }

    @Put('/:id')
    @Middleware('authorizeMiddleware')
    @Middleware('checkIfPermittedMiddleware')
    public async updatePost(req: Request, res: Response) {
        const result = await this.postsService.updatePost(parseInt(req.params.id), req.body);
        return res.send(result);
    }

    @Delete('/:id')
    @Middleware('authorizeMiddleware')
    @Middleware('checkIfPermittedMiddleware')
    public async deletePost(req: Request, res: Response) {
        const result = await this.postsService.deletePost(parseInt(req.params.id));
        return res.send(result);
    }
}

export default Post;
