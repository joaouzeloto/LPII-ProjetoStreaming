import mongoose from "mongoose";

const ListaUsuarioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',  // referencia para o model Usuario
    required: true
  },
  filmes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Filmes',  // referência para o model Filmes
  }],
  series: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',  // referência para o model Series
  }],
},
{
  timestamps: true
});

const ListaUsuarioModel = mongoose.model('ListaUsuario', ListaUsuarioSchema);

export default ListaUsuarioModel;
