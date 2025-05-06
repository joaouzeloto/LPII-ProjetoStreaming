import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import e from 'express';

const routerUsuario = express.Router();

routerUsuario.get('/', UsuarioController.visualizeUsuarios); // Visualizar todos os usuários
routerUsuario.get('/:id', UsuarioController.findUsuarioById); // Buscar usuário por ID
routerUsuario.post('/', UsuarioController.createUsuario); // Criar novo usuário
routerUsuario.put('/:id', UsuarioController.updateUsuario); // Atualizar usuário
routerUsuario.delete('/:id', UsuarioController.deleteUsuario); // Deletar usuário
routerUsuario.get('/email/:email', UsuarioController.findUsuarioByEmail); // Buscar usuário por email
routerUsuario.get('/exists/:email', UsuarioController.existsUsuario); // Verificar se o usuário existe por nome

export default routerUsuario;
