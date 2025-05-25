import Lista from '../models/ListaUsuarioModel.js';
import mongoose from 'mongoose';

class ListaUsuarioController {
  
  // Função auxiliar para validar ObjectId
  static isValidObjectId(id) {
    return id && 
           id !== 'undefined' && 
           id !== 'null' && 
           typeof id === 'string' && 
           mongoose.Types.ObjectId.isValid(id);
  }

  // Função auxiliar para logging de debug
  static logRequest(action, params) {
    console.log(`\n=== ${action} ===`);
    console.log('Parâmetros recebidos:', JSON.stringify(params, null, 2));
    console.log('Tipos:', {
      userId: typeof params.userId,
      filmeId: typeof params.filmeId,
      serieId: typeof params.serieId
    });
  }

  static async criarLista(req, res) {
    try {
      const { userId } = req.body;
      
      ListaUsuarioController.logRequest('CRIAR LISTA', { userId });
      
      if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      const lista = new Lista(userId);
      const listaCriada = await lista.criar();

      res.status(201).json(listaCriada);
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async adicionarFilme(req, res) {
    try {
      const { userId } = req.body;
      const { filmeId } = req.params;
      
      ListaUsuarioController.logRequest('ADICIONAR FILME', { userId, filmeId });
      
      // Validações
      if (!userId || !filmeId) {
        return res.status(400).json({ message: 'userId e filmeId são obrigatórios' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      if (!ListaUsuarioController.isValidObjectId(filmeId)) {
        return res.status(400).json({ message: 'filmeId deve ser um ObjectId válido' });
      }

      const listaAtualizada = await Lista.adicionarFilme(userId, filmeId);
      res.status(200).json(listaAtualizada);
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async removerFilme(req, res) {
    try {
      const { userId } = req.body;
      const { filmeId } = req.params;
      
      ListaUsuarioController.logRequest('REMOVER FILME', { userId, filmeId });
      
      // Validações
      if (!userId || !filmeId) {
        return res.status(400).json({ message: 'userId e filmeId são obrigatórios' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      if (!ListaUsuarioController.isValidObjectId(filmeId)) {
        return res.status(400).json({ message: 'filmeId deve ser um ObjectId válido' });
      }

      const listaAtualizada = await Lista.removerFilme(userId, filmeId);
      res.status(200).json(listaAtualizada);
    } catch (error) {
      console.error('Erro ao remover filme:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async adicionarSerie(req, res) {
    try {
      const { userId } = req.body;
      const { serieId } = req.params;
      
      ListaUsuarioController.logRequest('ADICIONAR SÉRIE', { userId, serieId });
      
      // Validações
      if (!userId || !serieId) {
        return res.status(400).json({ message: 'userId e serieId são obrigatórios' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      if (!ListaUsuarioController.isValidObjectId(serieId)) {
        return res.status(400).json({ message: 'serieId deve ser um ObjectId válido' });
      }

      const listaAtualizada = await Lista.adicionarSerie(userId, serieId);
      res.status(200).json(listaAtualizada);
    } catch (error) {
      console.error('Erro ao adicionar série:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async removerSerie(req, res) {
    try {
      const { userId } = req.body;
      const { serieId } = req.params;
      
      ListaUsuarioController.logRequest('REMOVER SÉRIE', { userId, serieId });
      
      // Validações detalhadas
      if (!userId || !serieId) {
        console.log('❌ Parâmetros faltando:', { userId: !!userId, serieId: !!serieId });
        return res.status(400).json({ message: 'userId e serieId são obrigatórios' });
      }

      if (serieId === 'undefined' || serieId === 'null') {
        console.log('❌ serieId é string undefined/null:', serieId);
        return res.status(400).json({ message: 'serieId inválido - recebido como string undefined' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        console.log('❌ userId inválido:', userId);
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      if (!ListaUsuarioController.isValidObjectId(serieId)) {
        console.log('❌ serieId inválido:', serieId);
        return res.status(400).json({ message: 'serieId deve ser um ObjectId válido' });
      }

      console.log('✅ Validações passaram, removendo série...');
      const listaAtualizada = await Lista.removerSerie(userId, serieId);
      console.log('✅ Série removida com sucesso');
      
      res.status(200).json(listaAtualizada);
    } catch (error) {
      console.error('❌ Erro ao remover série:', error);
      
      // Tratamento específico para erro de ObjectId
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ 
          message: 'ID inválido fornecido', 
          error: `Valor "${error.value}" não é um ObjectId válido`,
          field: error.path
        });
      }
      
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async excluirLista(req, res) {
    try {
      const { userId } = req.body;
      
      ListaUsuarioController.logRequest('EXCLUIR LISTA', { userId });
      
      if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      const listaExcluida = await Lista.excluirLista(userId);
      if (!listaExcluida) {
        return res.status(404).json({ message: 'Lista não encontrada' });
      }

      res.status(200).json({ message: 'Lista excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async buscarLista(req, res) {
    try {
      const { userId } = req.params;
      
      ListaUsuarioController.logRequest('BUSCAR LISTA', { userId });
      
      if (!userId) {
        return res.status(400).json({ message: 'userId é obrigatório' });
      }

      if (!ListaUsuarioController.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'userId deve ser um ObjectId válido' });
      }

      const lista = await Lista.buscarLista(userId);
      if (!lista) {
        return res.status(404).json({ message: 'Lista não encontrada' });
      }

      res.status(200).json(lista);
    } catch (error) {
      console.error('Erro ao buscar lista:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }
}

export default ListaUsuarioController;