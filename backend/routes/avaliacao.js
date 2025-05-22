import express from 'express';
import AvaliacaoController from '../controllers/AvaliacaoController.js';
import { checarPermissao } from '../middlewares/authMiddleware.js';

const routerAvaliacao = express.Router();

// Criar ou atualizar avaliação de filme ou série
routerAvaliacao.post('/', checarPermissao, AvaliacaoController.avaliar);

// Buscar avaliações de um filme
routerAvaliacao.get('/filme/:filmeId', checarPermissao, AvaliacaoController.buscarAvaliacoes);

// Buscar avaliações de uma série
routerAvaliacao.get('/serie/:serieId', checarPermissao, AvaliacaoController.buscarAvaliacoes);

// Buscar avaliação de um usuário para um filme
routerAvaliacao.get('/usuario/:userId/filme/:filmeId', checarPermissao, AvaliacaoController.buscarAvaliacaoUsuario);

// Buscar avaliação de um usuário para uma série
routerAvaliacao.get('/usuario/:userId/serie/:serieId', checarPermissao, AvaliacaoController.buscarAvaliacaoUsuario);

// Excluir avaliação
routerAvaliacao.delete('/:avaliacaoId', checarPermissao, AvaliacaoController.deletarAvaliacao);

export default routerAvaliacao;
