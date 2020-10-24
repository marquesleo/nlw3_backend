import express from 'express';
import './database/connection';
import 'express-async-errors';
import routes from './routes';
import path from 'path';
import errorHandler from './errors/handler';
import cors from 'cors';

const app = express();
/* habilita json */
app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/uploads',express.static(path.join(__dirname,'..','uploads')));
app.use(errorHandler);
app.listen(3333);

