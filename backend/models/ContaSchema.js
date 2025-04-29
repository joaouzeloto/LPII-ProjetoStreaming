import mongoose from "mongoose";
import Usuario from "./UsuarioSchema.js"; // Importando o modelo de Usuário

const ContaSchema = new mongoose.Schema({
        email: {type: String, required: true},
        senha: {type: String, required: true},
        tipo: {type: String, required: true}, // Adicionando o tipo da conta (cliente ou administrador)
        status: {type: String, required: true}, // Adicionando o status da conta (ativa ou inativa)
        usuarios: {type: [Usuario], required: true}, // Adicionando o número de usuários
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    }
);

const ContaModel = mongoose.model('Conta', ContaSchema);
export default ContaModel;