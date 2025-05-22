import express from 'express';
import ListaUsuarioController from '../controllers/ListaUsuarioController.js';
import { checarPermissao } from '../middlewares/authMiddleware.js';

const routerListaUsuario = express.Router();

// Criar lista para usuário
routerListaUsuario.post('/criar', checarPermissao, ListaUsuarioController.criarLista);

// Adicionar filme à lista do usuário (POST) /filme/:filmeId
routerListaUsuario.post('/filme/:filmeId', checarPermissao, ListaUsuarioController.adicionarFilme);

// Remover filme da lista do usuário (DELETE) /filme/:filmeId
routerListaUsuario.delete('/filme/:filmeId', checarPermissao, ListaUsuarioController.removerFilme);

// Adicionar série à lista do usuário (POST) /serie/:serieId
routerListaUsuario.post('/serie/:serieId', checarPermissao, ListaUsuarioController.adicionarSerie);

// Remover série da lista do usuário (DELETE) /serie/:serieId
routerListaUsuario.delete('/serie/:serieId', checarPermissao, ListaUsuarioController.removerSerie);

// Excluir toda a lista do usuário
routerListaUsuario.delete('/excluir', checarPermissao, ListaUsuarioController.excluirLista);

// Buscar lista completa do usuário (com filmes e séries populados)
routerListaUsuario.get('/:userId', checarPermissao, ListaUsuarioController.buscarLista);

export default routerListaUsuario;
