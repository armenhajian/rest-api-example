import dotenv from 'dotenv';
import IoC from './ioc';
import bodyParser from 'body-parser';
import express from 'express';
import router from './routes';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {dbConfig} from "./db";

dotenv.config();

IoC.init();

const app = express();

// parse application/json
app.use(bodyParser.json());

app.use(router);

createConnection(dbConfig).then(async (connection: any) => {

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await user.save();
    // console.log("Saved a new user with id: " + user.id);

}).catch((error: Error) => console.log(error));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

export default app;
