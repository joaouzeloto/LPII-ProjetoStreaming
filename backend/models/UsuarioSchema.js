import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        dtNascimento: {type: Date, required: true},
        apelido: {type: String, required: false},
        caminho: {type: String}, // Caminho da imagem
        email: {type: String, required: true, unique: true},
        senha: {type: String, required: true},
        endereco: {type: String}, // Campo único para endereço completo
        role: {
            type: String, 
            enum: ['admin', 'user'], 
            default: 'user', 
            required: true
        }
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    }
);

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);
export default UsuarioModel;