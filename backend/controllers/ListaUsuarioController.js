import Lista from '../models/ListaUsuarioModel.js';

class ListaUsuarioController {
  
  static async criarLista(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: 'userId é obrigatório' });

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
      if (!userId || !filmeId) return res.status(400).json({ message: 'userId e filmeId são obrigatórios' });

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
      if (!userId || !filmeId) return res.status(400).json({ message: 'userId e filmeId são obrigatórios' });

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
      if (!userId || !serieId) return res.status(400).json({ message: 'userId e serieId são obrigatórios' });

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
      if (!userId || !serieId) return res.status(400).json({ message: 'userId e serieId são obrigatórios' });

      const listaAtualizada = await Lista.removerSerie(userId, serieId);
      res.status(200).json(listaAtualizada);
    } catch (error) {
      console.error('Erro ao remover série:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async excluirLista(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: 'userId é obrigatório' });

      const listaExcluida = await Lista.excluirLista(userId);
      if (!listaExcluida) return res.status(404).json({ message: 'Lista não encontrada' });

      res.status(200).json({ message: 'Lista excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  static async buscarLista(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: 'userId é obrigatório' });

      const lista = await Lista.buscarLista(userId);
      if (!lista) return res.status(404).json({ message: 'Lista não encontrada' });

      res.status(200).json(lista);
    } catch (error) {
      console.error('Erro ao buscar lista:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }
}

export default ListaUsuarioController;
