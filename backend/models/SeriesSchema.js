import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema({
        nome: {type: String, required: true},
        genero: {type: String, required: true},
        sinopse: {type: String, required: true},
        anoLancamento: {type: String, required: true},
        duracao: {type: String, required: true},
        caminho: {type: String}, // Adicionando o caminho da imagem
        temporadas: {type: Number, required: true}, // Adicionando o número de temporadas
        episodios: {type: Number, required: true}, // Adicionando o número de episódios
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    }
);

const SeriesModel = mongoose.model('Series', SeriesSchema);
export default SeriesModel;