****REST API lib with DI and IoC with Typescript decorators

It's just basic demo, impossible to use as a library yet, improvements needed.


# Features
- @API
- @Get
- @Post
- @Put
- @Delete
- @Middleware
- @Inject
- @Injectable

..so transform any class into Express router with decorators:

# Example
```typescript
@API('users')
class User {
    
    @Inject('UserService')
    usersService: UserService;

    @Get('/:id')
    public async getById(req: Request, res: Response) {
        // ...
        return res.send()
    }
    
    /**
    * Add Express middleware with @Middleware 
    */
    @Delete('/:id')
    @Middleware('authorizeMiddleware')
    public async deleteUser(req: Request, res: Response) {
        const result = await this.usersService.deleteUser(parseInt(req.params.id));
        return res.send(result);
    }

    public static async authorizeMiddleware(req: Request, res: Response, next: NextFunction) {
        // ...
        next()
    }

}
```


# TODO

- Separate lib from code and normalize structure
- Auto import of controllers and services
- Add Utils Class [injectable]
- Add tests
