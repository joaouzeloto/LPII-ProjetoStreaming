import UsuarioModel from "./UsuarioSchema.js";

class Usuario {
    constructor(nome, dtNascimento, apelido, caminho) {
        this.nome = nome;
        this.dtNascimento = dtNascimento;
        this.apelido = apelido;
        this.caminho = caminho; // Adicionando o caminho da imagem
    }

    // Salvar novo usuário
    async save() {
        const novoUsuario = new UsuarioModel({
            nome: this.nome,
            dtNascimento: this.dtNascimento,
            apelido: this.apelido,
            caminho: this.caminho,
            email: this.email,
            senha: this.senha
        });
        return await novoUsuario.save();
    }

    // Encontrar todos
    static async findAll() {
        return await UsuarioModel.find();
    }

    // Encontrar por ID
    static async findById(id) {
        return await UsuarioModel.findById(id);
    }

    static async findByEmail(email) {
        return await UsuarioModel.find({ email });
    }

    // Atualizar usuário por ID
    static async update(id, dados) {
        return await UsuarioModel.findByIdAndUpdate(
            id,
            { $set: dados },
            { new: true, runValidators: true }
        );
    }

    // Deletar usuário por ID
    static async delete(id) {
        return await UsuarioModel.findByIdAndDelete(id);
    }
}

export default Usuario;