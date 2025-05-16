import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
        nome: {type: String, required: true},
        dtNascimento: {type: String, required: true},
        apelido: {type: String, required: false},
        caminho: {type: String}, // Adicionando o caminho da imagem
        email: {type: String, required: true},
        senha: {type: String, required: true},
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    }
);

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
export default UsuarioModel;