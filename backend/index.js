import express from 'express'
import path from 'path'
import __dirname from './utils/pathUtils.js'
import dotenv from 'dotenv'
import cors from 'cors'
import {
  staticMiddleware,
  urlencodedMiddleware,
  jsonMiddleware,
  securityMiddleware,
  compressionMiddlewware,
  rateLimitMiddleware,
  morganMiddleware
} from './middlewares/middleware.js'
import filmesRouter from './routes/filme.js';
import userRouter from './routes/usuario.js';
import seriesRouter from './routes/series.js';
import loginRouter from './routes/login.js';
import routerListaUsuario from './routes/listausuario.js';
import connectBD from './config/db.js'




// Carregar variáveis de ambiente
dotenv.config()

const app = express()
const port = process.env.PORT || 3000



// Conectar ao banco de dados MongoDB
connectBD()

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())
app.use(staticMiddleware)
app.use(urlencodedMiddleware)
app.use(jsonMiddleware)
app.use(securityMiddleware)
app.use(compressionMiddlewware)
// app.use(rateLimitMiddleware)
app.use(morganMiddleware)


// Rotas
app.use('/filmes', filmesRouter)
app.use('/usuario', userRouter)
app.use('/series', seriesRouter)
app.use('/login', loginRouter)
app.use('/listausuario', routerListaUsuario)
// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor ativo rodando na porta ${port}`)
})
