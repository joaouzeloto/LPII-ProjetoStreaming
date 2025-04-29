import SeriesModel from "./SeriesSchema.js";

class Series {
    constructor(nome, genero, sinopse, anoLancamento, duracao, caminho, temporadas, episodios) {
        this.nome = nome;
        this.genero = genero;
        this.sinopse = sinopse;
        this.anoLancamento = anoLancamento;
        this.duracao = duracao;
        this.caminho = caminho; // Adicionando o caminho da imagem
        this.temporadas = temporadas; // Adicionando o número de temporadas
        this.episodios = episodios; // Adicionando o número de episódios
    }

    // Método para salvar uma nova série
    async save() {
        const novaSerie = new SeriesModel({
            nome: this.nome,
            genero: this.genero,
            sinopse: this.sinopse,
            anoLancamento: this.anoLancamento,
            duracao: this.duracao,
            caminho: this.caminho, // Adicionando o campo caminho para salvar a imagem
            temporadas: this.temporadas, // Adicionando o número de temporadas
            episodios: this.episodios // Adicionando o número de episódios
        });
        return await novaSerie.save();
    }

    // Método para encontrar todas as séries
    static async findAll() {
        return await SeriesModel.find();
    }

    // Método para encontrar série por ID
    static async findById(id) {
        return await SeriesModel.findById(id);
    }

    // Método para atualizar série
    static async update(id, serie) {
        return await SeriesModel.findByIdAndUpdate(id, serie, { new: true });  // Adicionando opção de retornar a série atualizada
    }

    // Método para excluir série
    static async delete(id) {
        return await SeriesModel.findByIdAndDelete(id); // Exclui a série pelo ID
    }
}

export default Series;