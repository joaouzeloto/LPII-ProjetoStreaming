import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
        nome: {type: String, required: true},
        dtNascimento: {type: String, required: true},
        apelido: {type: String, required: true},
        caminho: {type: String}, // Adicionando o caminho da imagem
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    }
);

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
export default UsuarioModel;