import FilmesModel from "./FilmesSchema.js";

class Filmes {
    constructor(nome, genero, sinopse, anoLancamento, duracao, caminho) {
        this.nome = nome;
        this.genero = genero;
        this.sinopse = sinopse;
        this.anoLancamento = anoLancamento;
        this.duracao = duracao;
        this.caminho = caminho; // Adicionando o caminho da imagem
    }

    // Método para salvar um novo filme
    async save() {
        const novoFilme = new FilmesModel({
            nome: this.nome,
            genero: this.genero,
            sinopse: this.sinopse,
            anoLancamento: this.anoLancamento,
            duracao: this.duracao,
            caminho: this.caminho // Adicionando o campo caminho para salvar a imagem
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
        return await FilmesModel.findByIdAndUpdate(id, filme, { new: true });  // Adicionando opção de retornar o filme atualizado
    }

    // Método para excluir filme
    static async delete(id) {
        return await FilmesModel.findByIdAndDelete(id); // Exclui o filme pelo ID
    }
}

export default Filmes;