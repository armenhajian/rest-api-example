import {Post, User} from '../db';
import {Injectable} from "../decorators";

@Injectable
class PostService {

    constructor() {
        console.log('Hello from PostService');
    }

    public async getPosts(filter?: any) {
        return await Post.find();
    }

    public async getPost(id: number) {
        return await Post.findOne(id);
    }

    public async createPost(data: Post, userId: number) {
        const post = await Post.create(data);
        const user = await User.findOne(userId);
        user.posts = [post];
        await User.save(user);

        return await Post.save(post);
    }

    public async updatePost(id: number, data: any) {
        const post = await Post.findOne(id);
        Post.merge(post, data);
        return await Post.save(post);
    }

    public async deletePost(id: number) {
        return await Post.delete(id);
    }
}

export default PostService;
