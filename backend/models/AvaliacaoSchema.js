import mongoose from "mongoose";

const AvaliacaoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',  // Referência ao modelo Usuario
        required: true
    },
    filmeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Filmes',  // Referência ao modelo Filmes
        required: false
    },
    serieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Series',  // Referência ao modelo Series
        required: false
    },
    nota: {
        type: Number,
        required: true,
        min: 1,
        max: 5  // A nota pode ser entre 1 e 5
    }
}, {
    timestamps: true  // Para registrar automaticamente as datas de criação e atualização
});

const AvaliacaoModel = mongoose.model('Avaliacao', AvaliacaoSchema);

export default AvaliacaoModel;
