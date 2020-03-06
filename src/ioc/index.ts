import dependencies from "./dependencies";
import {UserService} from "../services";
import {Post, User} from "../controllers";

export default class IoC {

    private static instance: IoC;
    private static controllersList: any[] = [
        User,
        Post,
    ];
    private dependencyList: any = [
        UserService
    ];

    constructor() {
        console.log('Initializing singleton IoC class');
    }

    public static init() {
        this.Instance();
        this.initControllers();
    }

    public static getInstance(constructor: any) {
        const dependency = this.Instance().getDependency(constructor.name);
        if (!dependency) {
            const classInstance = new constructor();
            this.Instance().addDependency(constructor.name, classInstance);
            console.log(`Created instance for ${constructor.name} and added to dependencies`);
        }

        return this.Instance().getDependency(constructor.name);
    }

    private static Instance() {
        if (!IoC.instance) {
            IoC.instance = new IoC();
            console.log('IoC instance created!');
        }

        return IoC.instance;
    }

    private static initControllers() {
        IoC.controllersList.forEach(controller => {
            console.log(`Get instance for ${controller.name} controller...`);
            IoC.getInstance(controller);
        })
    }

    addDependency(key: string, value: Object) {
        dependencies.set(key, value);
    };

    getDependencies() {
        return dependencies;
    };

    getDependency(key: string) {
        return dependencies.get(key);
    };

    initDependencies() {
        this.dependencyList.forEach((dep: any) => {
            this.addDependency(dep.name, new dep());
        })
    };
}
