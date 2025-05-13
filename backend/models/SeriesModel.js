import FilmesModel from "./FilmesSchema.js";

class Filmes {
  constructor(nome, genero, sinopse, anoLancamento, duracao, caminho) {
    this.nome = nome;
    this.genero = genero;
    this.sinopse = sinopse;
    this.anoLancamento = anoLancamento;
    this.duracao = duracao;
    this.caminho = caminho; // Caminho da imagem
  }
  
  // Método para salvar um novo filme
  async save() {
    const novoFilme = new FilmesModel({
      nome: this.nome,
      genero: this.genero,
      sinopse: this.sinopse,
      anoLancamento: this.anoLancamento,
      duracao: this.duracao,
      caminho: this.caminho // Campo caminho para salvar a imagem
    });
    return await novoFilme.save();
  }
  
  // Método para encontrar todos os filmes
  static async findAll() {
    return await FilmesModel.find();
  }
  
  // Método para encontrar filme por ID
  static async findById(id) {
    return await FilmesModel.findById(id);
  }
  
  // Método para atualizar filme
  static async update(id, filme) {
    // Preparar objeto de atualização a partir da instância de Filmes
    const updateData = {
      nome: filme.nome,
      genero: filme.genero,
      sinopse: filme.sinopse,
      anoLancamento: filme.anoLancamento,
      duracao: filme.duracao
    };
    
    // Adicionar caminho apenas se não for null ou undefined
    if (filme.caminho) {
      updateData.caminho = filme.caminho;
    }
    
    return await FilmesModel.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  // Método para excluir filme
  static async delete(id) {
    return await FilmesModel.findByIdAndDelete(id);
  }
  
  // Método para buscar filme por nome
  static async searchByName(nome) {
    return await FilmesModel.find({ nome: { $regex: nome, $options: 'i' } });
  }
  
  // Método para buscar filme por gênero
  static async searchByGenre(genero) {
    return await FilmesModel.find({ genero: { $regex: genero, $options: 'i' } });
  }
  
  // Método para buscar filme por ano de lançamento
  static async searchByReleaseYear(anoLancamento) {
    return await FilmesModel.find({ anoLancamento: { $regex: anoLancamento, $options: 'i' } });
  }
}

export default Filmes;