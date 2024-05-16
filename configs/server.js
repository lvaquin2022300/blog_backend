'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import publiRoutes from '../src/publication/publication.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/forchan_2/v1/usuarios';
        this.publiPath = '/forchan_2/v1/publications';
        this.commentPath = '/forchan_2/v1/comments';

        this.conectarDB();

        this.middlewares();

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.usuariosPath, userRoutes);
        this.app.use(this.publiPath, publiRoutes);
        this.app.use(this.commentPath, commentRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}


export default Server;