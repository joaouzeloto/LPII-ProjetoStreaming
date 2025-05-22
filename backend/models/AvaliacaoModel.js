import AvaliacaoModel from "./AvaliacaoSchema.js";  // Importa o modelo de Avaliação

class Avaliacao {
  constructor(userId, filmeId, serieId, nota) {
    this.userId = userId;
    this.filmeId = filmeId;
    this.serieId = serieId;
    this.nota = nota;
  }

  // Método para salvar uma nova avaliação
  async save() {
    const novaAvaliacao = new AvaliacaoModel({
      userId: this.userId,
      filmeId: this.filmeId,
      serieId: this.serieId,
      nota: this.nota
    });
    return await novaAvaliacao.save();
  }

  // Método para encontrar todas as avaliações
  static async findAll() {
    return await AvaliacaoModel.find();
  }

  // Método para encontrar avaliação por ID
  static async findById(id) {
    return await AvaliacaoModel.findById(id);
  }

  // Método para atualizar avaliação
  static async update(id, avaliacao) {
    return await AvaliacaoModel.findByIdAndUpdate(id, avaliacao, { new: true });  // Retorna a avaliação atualizada
  }

  // Método para excluir avaliação
  static async delete(id) {
    return await AvaliacaoModel.findByIdAndDelete(id); // Exclui a avaliação pelo ID
  }

  static async findFilemOrSerie(id) {
    return await AvaliacaoModel.findOne({
      $or: [
        { filmeId: id },
        { serieId: id }
      ]
    });
  }

  // Método para buscar avaliação por filme
  static async searchByFilme(filmeId) {
    return await AvaliacaoModel.find({ filmeId });
  }

  // Método para buscar avaliação por série
  static async searchBySerie(serieId) {
    return await AvaliacaoModel.find({ serieId });
  }

  // Método para buscar avaliação por usuário
  static async searchByUser(userId) {
    return await AvaliacaoModel.find({ userId });
  }

  // Método para buscar avaliação por filme ou série (dependendo de qual campo é preenchido)
  static async searchByFilmOrSerie(filmeId, serieId) {
    return await AvaliacaoModel.find({
      $or: [
        { filmeId },
        { serieId }
      ]
    });
  }
}

export default Avaliacao;
