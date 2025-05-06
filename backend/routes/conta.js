import express from 'express';
import ContaController from '../controllers/ContaController.js';

const routerConta = express.Router();

routerConta.get('/', ContaController.visualizeContas); // Visualizar todas as contas
routerConta.get('/:id', ContaController.findContaById);
routerConta.post('/', ContaController.createConta); // Criar nova conta
routerConta.put('/:id', ContaController.updateConta); // Atualizar conta
routerConta.delete('/:id', ContaController.deleteConta); // Deletar conta
routerConta.get('/email/:email', ContaController.findContaByEmail); // Buscar conta por email
routerConta.get('/exists/:nome', ContaController.findContaByName); // Verificar se a conta existe por nome

export default routerConta;