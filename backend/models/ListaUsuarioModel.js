import ListaUsuarioModel from "./ListaUsuarioSchema.js"; // importe seu schema

class Lista {
  constructor(userId) {
    this.userId = userId;
  }

  // Criar uma nova lista para o usuário (se não existir)
  async criar() {
    // Verifica se já existe lista para o usuário
    let lista = await ListaUsuarioModel.findOne({ userId: this.userId });
    if (!lista) {
      lista = new ListaUsuarioModel({ userId: this.userId, filmes: [], series: [] });
      await lista.save();
    }
    return lista;
  }

  // Adicionar filme à lista do usuário
  static async adicionarFilme(userId, filmeId) {
    return await ListaUsuarioModel.findOneAndUpdate(
      { userId },
      { $addToSet: { filmes: filmeId } }, // $addToSet evita duplicatas
      { new: true, upsert: true }
    );
  }

  // Remover filme da lista do usuário
  static async removerFilme(userId, filmeId) {
    return await ListaUsuarioModel.findOneAndUpdate(
      { userId },
      { $pull: { filmes: filmeId } },
      { new: true }
    );
  }

  // Adicionar série à lista do usuário
  static async adicionarSerie(userId, serieId) {
    return await ListaUsuarioModel.findOneAndUpdate(
      { userId },
      { $addToSet: { series: serieId } },
      { new: true, upsert: true }
    );
  }

  // Remover série da lista do usuário
  static async removerSerie(userId, serieId) {
    return await ListaUsuarioModel.findOneAndUpdate(
      { userId },
      { $pull: { series: serieId } },
      { new: true }
    );
  }

  // Excluir a lista inteira do usuário
  static async excluirLista(userId) {
    return await ListaUsuarioModel.findOneAndDelete({ userId });
  }

  // Buscar a lista pelo userId, já populando filmes e series
  static async buscarLista(userId) {
    return await ListaUsuarioModel.findOne({ userId })
      .populate('filmes')
      .populate('series');
  }
}

export default Lista;
