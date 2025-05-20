import express from 'express';
import ContaController from '../controllers/ContaController.js';
import  {checarPermissao}  from '../middlewares/authMiddleware.js';

const routerConta = express.Router();

routerConta.get('/', checarPermissao,ContaController.visualizeContas); // Visualizar todas as contas
routerConta.get('/:id', checarPermissao,ContaController.findContaById);
routerConta.post('/', checarPermissao,ContaController.createConta); // Criar nova conta
routerConta.put('/:id', checarPermissao,ContaController.updateConta); // Atualizar conta
routerConta.delete('/:id', checarPermissao,ContaController.deleteConta); // Deletar conta
routerConta.get('/email/:email', checarPermissao,ContaController.findContaByEmail); // Buscar conta por email
routerConta.get('/exists/:nome', checarPermissao,ContaController.findContaByName); // Verificar se a conta existe por nome

export default routerConta;