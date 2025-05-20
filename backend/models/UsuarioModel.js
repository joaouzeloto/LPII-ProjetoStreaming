import UsuarioModel from "./UsuarioSchema.js";

class Usuario {
    constructor(nome, dtNascimento, apelido, caminho, endereco, role = 'user') {
        this.nome = nome;
        this.dtNascimento = dtNascimento;
        this.apelido = apelido;
        this.caminho = caminho;
        this.endereco = endereco;
        this.role = role; // Novo campo role
    }
    
    // Salvar novo usuário
    async save() {
        const novoUsuario = new UsuarioModel({
            nome: this.nome,
            dtNascimento: this.dtNascimento,
            apelido: this.apelido,
            caminho: this.caminho,
            email: this.email,
            senha: this.senha,
            endereco: this.endereco,
            role: this.role
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
    
    // Encontrar um com condições específicas
    static async findOne(conditions) {
        return await UsuarioModel.findOne(conditions);
    }
    
    // Encontrar por email
    static async findByEmail(email) {
        return await UsuarioModel.findOne({ email });
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
    static async findByIdAndDelete(id) {
        return await UsuarioModel.findByIdAndDelete(id);
    }
    
    // Contar documentos
    static async countDocuments(conditions) {
        return await UsuarioModel.countDocuments(conditions);
    }
}

export default Usuario;