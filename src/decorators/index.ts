import {NextFunction, Request, Response} from "express";
import dependencies from "../ioc/dependencies";

const endpoints: any = {
    get: [],
    post: [],
    put: [],
    delete: [],
};
const middlewares: any = [];

export function API(base: string) {
    console.log('Init API', base);

    return function (target: any) {

        Object.keys(endpoints).forEach(method => {
            endpoints[method].forEach((data: any) => {
                if (target.name === data.target.constructor.name) {
                    data.baseUrl = base;
                }

                data.middlewares = data.middlewares || [
                    (req: Request, res: Response, next: NextFunction) => {
                        console.log('Hey from default middleware');
                        next()
                    }
                ];

                middlewares.forEach((mid: any) => {
                    if (mid.propertyKey === data.propertyKey && target.name === mid.target.constructor.name && target.name === data.target.constructor.name) {
                        data.middlewares.push(target[mid.fnName]);
                    }
                })

            });
        })
    }
}

export function Get(slug: string) {
    return apiEndpointHandler(slug, 'get');
}

export function Post(slug: string) {
    return apiEndpointHandler(slug, 'post');
}

export function Put(slug: string) {
    return apiEndpointHandler(slug, 'put');
}

export function Delete(slug: string) {
    return apiEndpointHandler(slug, 'delete');
}

export function Middleware(fnName: string) {
    return function (target: any, propertyKey: string, descriptor: any) {
        middlewares.push({
            fnName,
            target,
            propertyKey,
            descriptor,
            handler: () => descriptor.value
        });
    }
}

export function Inject(className: string) {
    console.log('inject', className);
    return function (target: any, propertyKey: string): any {
        target[propertyKey] = dependencies.get(className);
    }
}

export function Injectable(constructor: any) {
    console.log('injectable', constructor.name);
    dependencies.set(constructor.name, new constructor());
    console.log(`Created instance for ${constructor.name} and added to dependencies`);
}

function apiEndpointHandler(slug: string, method: string) {
    return function (target: any, propertyKey: string, descriptor: any) {

        endpoints[method].push({
            slug,
            target,
            propertyKey,
            descriptor,
            handler: descriptor.value
        });
    }
}

export {endpoints};
