import express, {NextFunction, Request, Response} from 'express';
import {endpoints} from "./decorators";
import IoC from './ioc';

IoC.init();
const router = express.Router();

Object.keys(endpoints).forEach((method: string) => {
    endpoints[method].forEach((endpoint: any) => {
        const route = `/${endpoint.baseUrl}${endpoint.slug}`;
        console.log(`Initializing express ${method.toUpperCase()} route ${route}`);

        // @ts-ignore
        router[method](
            route,
            [...(endpoint.middlewares || [])],
            (req: Request, res: Response, next: NextFunction) => {
                IoC.getInstance(endpoint.target.constructor)[endpoint.propertyKey](req, res, next);
            }
        );
    });
});


export default router;
