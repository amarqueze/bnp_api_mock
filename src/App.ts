import * as express from 'express'
import * as bodyParser from 'body-parser';

import bnpRouter from './routes/bnp.router';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.enableCors();
        this.mountRoutes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json({limit: '50mb', extended: true}));
        this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    }
    // Configure API endpoints.
    private mountRoutes(): void {
        this.express.use('/riel', bnpRouter);
    }

    private enableCors() {
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE,PATCH");
            next();
        });
    }
}

export default new App().express
