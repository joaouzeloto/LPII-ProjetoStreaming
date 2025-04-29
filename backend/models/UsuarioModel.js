import UsuarioModel from "./UsuarioSchema.js";

class Usuario {
    constructor(nome, dtNascimento, apelido, caminho) {
        this.nome = nome;
        this.dtNascimento = dtNascimento;
        this.apelido = apelido;
        this.caminho = caminho; // Adicionando o caminho da imagem
    }

    // Método para salvar um novo usuário
    async save() {
        const novoUsuario = new UsuarioModel({
            nome: this.nome,
            dtNascimento: this.dtNascimento,
            apelido: this.apelido,
            caminho: this.caminho // Adicionando o campo caminho para salvar a imagem
        });
        return await novoUsuario.save();
    }

    // Método para encontrar todos os usuários
    static async findAll() {
        return await UsuarioModel.find();
    }

    // Método para encontrar usuário por ID
    static async findById(id) {
        return await UsuarioModel.findById(id);
    }

    // Método para atualizar usuário
    static async update(id, usuario) {
        return await UsuarioModel.findByIdAndUpdate(id, usuario, { new: true });
    }  // Adicionando opção de retornar o usuário atualizado

    static async delete(id) {
        return await UsuarioModel.findByIdAndDelete(id); // Exclui o usuário pelo ID
    }

}

export default Usuario;