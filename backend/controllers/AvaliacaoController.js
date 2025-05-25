import Avaliacao from "../models/AvaliacaoModel.js";  // Importa a classe que manipula o modelo de Avaliação

class AvaliacaoController {

  // Criar ou atualizar avaliação
  static async avaliar(req, res) {
    try {
     
      const { userId, filmeId, serieId, nota } = req.body;
      if (!userId || (!filmeId && !serieId) || !nota) {
        return res.status(400).json({ message: 'userId, filmeId/serieId e nota são obrigatórios' });
      }

      const avaliacao = new Avaliacao(userId, filmeId, serieId, nota);
      const resultado = await avaliacao.save();
      res.status(201).json({ message: 'Avaliação criada com sucesso', resultado });
    } catch (error) {
      console.error('Erro ao criar/atualizar avaliação:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  // Buscar todas as avaliações de um filme ou série
  static async buscarAvaliacoes(req, res) {
    try {
      const { filmeId, serieId } = req.params;
      const filtro = filmeId ? { filmeId } : { serieId };

      const avaliacoes = await Avaliacao.findFilemOrSerie(filtro);
      if (!avaliacoes || avaliacoes.length === 0) {
        return res.status(404).json({ message: 'Nenhuma avaliação encontrada' });
      }

      res.status(200).json(avaliacoes);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  // Buscar avaliação de um usuário para um filme ou série
  static async buscarAvaliacaoUsuario(req, res) {
    try {
      const { userId, filmeId, serieId } = req.params;
      const filtro = filmeId ? { userId, filmeId } : { userId, serieId };

      const avaliacao = await Avaliacao.findOne(filtro);
      if (!avaliacao) {
        return res.status(404).json({ message: 'Avaliação não encontrada' });
      }

      res.status(200).json(avaliacao);
    } catch (error) {
      console.error('Erro ao buscar avaliação do usuário:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }

  // Deletar uma avaliação
  static async deletarAvaliacao(req, res) {
    try {
      const { avaliacaoId } = req.params;
      const avaliacao = await Avaliacao.delete(avaliacaoId);
      if (!avaliacao) {
        return res.status(404).json({ message: 'Avaliação não encontrada' });
      }
      res.status(200).json({ message: 'Avaliação excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      res.status(500).json({ message: 'Erro interno', error: error.message });
    }
  }
}

export default AvaliacaoController;
