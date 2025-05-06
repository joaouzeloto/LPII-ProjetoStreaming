import ContaModel from "./ContaSchema.js";

class Conta {
    constructor(email, senha, tipo, status, usuarios) {
        this.email = email;
        this.senha = senha;
        this.tipo = tipo; // Adicionando o tipo da conta (cliente ou administrador)
        this.status = status; // Adicionando o status da conta (ativa ou inativa)
        this.usuarios = usuarios; // Adicionando o número de usuários
    }

    // Método para salvar uma nova conta
    async save() {
        const novaConta = new ContaModel({
            email: this.email,
            senha: this.senha,
            tipo: this.tipo,
            status: this.status,
            usuarios: this.usuarios
        });
        return await novaConta.save();
    }

    // Método para encontrar todas as contas
    static async findAll() {
        return await ContaModel.find();
    }

    // Método para encontrar conta por ID
    static async findById(id) {
        return await ContaModel.findById(id);
    }

    // Método para encontrar conta por email
    static async findByEmail(email) {
        return await ContaModel.findOne({ email: email });
    }

    // Método para atualizar conta
    static async update(id, conta) {
        return await ContaModel.findByIdAndUpdate(id, conta, { new: true });  // Adicionando opção de retornar a conta atualizada
    }

    // Método para excluir conta
    static async delete(id) {
        return await ContaModel.findByIdAndDelete(id); // Exclui a conta pelo ID
    }

    // Método para verificar se a conta existe
    static async exists(email) {
        return await ContaModel.exists({ email: email });
    }

    // Método para verificar se a conta está ativa
    static async addUser(email, user) {
        const conta = await ContaModel.findOne({ email: email });
        if (conta) {
            conta.usuarios.push(user);
            return await conta.save();
        } else {
            throw new Error("Conta não encontrada");
        }
    }
}

export default Conta;