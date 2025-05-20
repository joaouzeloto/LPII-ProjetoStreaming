import SeriesModel from "./SeriesSchema.js";

class Series {
  constructor(nome, genero, sinopse, anoLancamento, duracao, caminho, temporadas, episodios) {
    this.nome = nome;
    this.genero = genero;
    this.sinopse = sinopse;
    this.anoLancamento = anoLancamento;
    this.duracao = duracao;
    this.caminho = caminho; // Caminho da imagem
    this.temporadas = temporadas; // Número de temporadas
    this.episodios = episodios; // Número total de episódios
  }
  
  // Método para salvar uma nova série
  async save() {
    const novaSerie = new SeriesModel({
      nome: this.nome,
      genero: this.genero,
      sinopse: this.sinopse,
      anoLancamento: this.anoLancamento,
      duracao: this.duracao,
      caminho: this.caminho,
      temporadas: this.temporadas,
      episodios: this.episodios
    });
    return await novaSerie.save();
  }
  
  // Método para encontrar todas as séries
  static async findAll() {
    // Certifique-se de retornar apenas documentos da coleção de séries
    return await SeriesModel.find();
  }
  
  // Método para encontrar série por ID
  static async findById(id) {
    // Garante que estamos buscando apenas séries
    return await SeriesModel.findById(id);
  }
  
  // Método para atualizar série
  static async update(id, serie) {
    // Preparar objeto de atualização a partir da instância de Series
    const updateData = {
      nome: serie.nome,
      genero: serie.genero,
      sinopse: serie.sinopse,
      anoLancamento: serie.anoLancamento,
      duracao: serie.duracao,
      temporadas: serie.temporadas,
      episodios: serie.episodios
    };
    
    // Adicionar caminho apenas se não for null ou undefined
    if (serie.caminho) {
      updateData.caminho = serie.caminho;
    }
    
    return await SeriesModel.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  // Método para excluir série
  static async delete(id) {
    return await SeriesModel.findByIdAndDelete(id);
  }
  
  // Método para buscar série por nome
  static async searchByName(nome) {
    return await SeriesModel.find({ nome: { $regex: nome, $options: 'i' } });
  }
  
  // Método para buscar série por gênero
  static async searchByGenre(genero) {
    return await SeriesModel.find({ genero: { $regex: genero, $options: 'i' } });
  }
  
  // Método para buscar série por ano de lançamento
  static async searchByReleaseYear(anoLancamento) {
    return await SeriesModel.find({ anoLancamento: { $regex: anoLancamento, $options: 'i' } });
  }
}

export default Series;