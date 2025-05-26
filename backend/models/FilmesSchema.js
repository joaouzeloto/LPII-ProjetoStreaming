import mongoose from "mongoose";

const FilmesSchema = new mongoose.Schema(
  {
    nome: {type: String, required: true},
    genero: {type: String, required: true},
    sinopse: {type: String, required: true},
    anoLancamento: {type: String, required: true},
    duracao: {type: String, required: true},
    caminho: {type: String}, // Campo para a imagem
    caminhoFilme: {type: String}, // Campo para o filme
  },
  {
    timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
  }
);

const FilmesModel = mongoose.model('Filmes', FilmesSchema);

export default FilmesModel;