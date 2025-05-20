import  {checarPermissao}  from '../middlewares/authMiddleware.js';
import express from 'express';
import LoginController from '../controllers/LoginController.js';

const routerLogin = express.Router();

routerLogin.post('/', LoginController.login); // Rota para login

export default routerLogin;