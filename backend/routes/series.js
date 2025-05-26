import express from 'express';
import multer from 'multer';
import path from 'path';
import SeriesController from '../controllers/SeriesController.js';
import __dirname from '../utils/pathUtils.js';
import {checarPermissao} from '../middlewares/authMiddleware.js';

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
    fileSize: 500 * 1024 * 1024 // Limite de 500MB para arquivos de vídeo
  },
  fileFilter: function(req, file, cb) {
    // Aceitar imagens para o campo 'imagem'
    if (file.fieldname === 'imagem') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Apenas arquivos de imagem são permitidos para o campo imagem'), false);
      }
    }
    // Aceitar vídeos para o campo 'serie'
    else if (file.fieldname === 'serie') {
      if (file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream') {
        cb(null, true);
      } else {
        cb(new Error('Apenas arquivos de vídeo são permitidos para o campo série'), false);
      }
    }
    else {
      cb(new Error('Campo de arquivo não reconhecido'), false);
    }
  }
});

const routerSeries = express.Router();

// Servir os arquivos estáticos da pasta uploads
routerSeries.use('/uploads', express.static(path.join(__dirname, '../ember/uploads')));

// Configuração para aceitar múltiplos campos de arquivo
const uploadFields = upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'serie', maxCount: 1 }
]);

routerSeries.get("/", checarPermissao, SeriesController.visualizeSeries);
routerSeries.post("/", uploadFields, checarPermissao, SeriesController.createSeries);
routerSeries.put("/:id", uploadFields, checarPermissao, SeriesController.updateSeries);
routerSeries.delete("/:id", checarPermissao, SeriesController.deleteSeries);
routerSeries.get("/:id", checarPermissao, SeriesController.visualizeSeriesById);
routerSeries.get("/search/:nome", checarPermissao, SeriesController.searchSeriesByName);

export default routerSeries;