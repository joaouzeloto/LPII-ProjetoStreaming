import express from 'express'
import path from 'path'
import __dirname from './utils/pathUtils.js';
import dotenv from 'dotenv';
import cors from 'cors';
import {
    staticMiddleware,
    urlencodedMiddleware, jsonMiddleware,
    securityMiddleware, compressionMiddlewware,
    rateLimitMiddleware, morganMiddleware
} from './middlewares/middleware.js';
//import router from './routes/routes.js';
import connectBD from './config/db.js';


//Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT;

//Conecta ao banco de dados MongoDB
connectBD();



app.use(cors());
//Registrando Middlewares
app.use(express.json());
app.use(staticMiddleware);
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddlewware);
//app.use(rateLimitMiddleware);
app.use(morganMiddleware);



app.listen(port, () => {
    console.log(`Servidor ativo rodando na porta ${port}`)
});