import express from 'express';
import multer from 'multer';
import path from 'path';
import FilmesController from '../controllers/FilmesController.js';
import __dirname from '../utils/pathUtils.js';

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../ember/uploads'));
  },
  filename: function(req, file, cb) {
    // Gerar um nome de arquivo único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// Configurar o multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

const routerFilme = express.Router();

// Servir os arquivos estáticos da pasta uploads
routerFilme.use('/uploads', express.static(path.join(__dirname, '../ember/uploads')));

// Rotas
routerFilme.get('/', FilmesController.visualizeFilmes);
routerFilme.post('/', upload.single('imagem'), FilmesController.createFilme);
routerFilme.put('/:id', upload.single('imagem'), FilmesController.updateFilme);
routerFilme.delete('/:id', FilmesController.deleteFilme);
routerFilme.get('/:id', FilmesController.visualizeFilmeById);
routerFilme.get('/search/:nome', FilmesController.searchFilmeByName);
routerFilme.get('/genre/:genero', FilmesController.searchFilmeByGenre);
routerFilme.get('/year/:anoLancamento', FilmesController.searchFilmeByReleaseYear);

export default routerFilme;