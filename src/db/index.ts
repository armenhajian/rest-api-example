import {Post, User} from "./entities";

const dbConfig: any = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "rest-api-example",
    entities: [
        User,
        Post,
    ],
    synchronize: true,
    logging: false
};

export {
    User,
    Post,
    dbConfig
};
