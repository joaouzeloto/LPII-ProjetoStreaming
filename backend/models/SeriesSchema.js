import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    genero: {type: String, required: true},
    sinopse: {type: String, required: true},
    anoLancamento: {type: String, required: true},
    duracao: {type: String, required: true},
    caminho: {type: String}, // Caminho da imagem
    caminhoSerie: {type: String}, // Caminho do arquivo da série
    temporadas: {type: Number, required: true}, // Número de temporadas
    episodios: {type: Number, required: true}, // Número de episódios
},
{
    timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
});

const SeriesModel = mongoose.model('Series', SeriesSchema);
export default SeriesModel;