import express from 'express';
import multer from 'multer';
import path from 'path';
import SeriesController from '../controllers/SeriesController.js';
import __dirname from '../utils/pathUtils.js';
import {checarPermissao}  from '../middlewares/authMiddleware.js';

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

const routerSeries = express.Router();

// Servir os arquivos estáticos da pasta uploads
routerSeries.use('/uploads', express.static(path.join(__dirname, '../ember/uploads')));

routerSeries.get("/", checarPermissao,SeriesController.visualizeSeries);
routerSeries.post("/", upload.single('imagem'), checarPermissao,SeriesController.createSeries);
routerSeries.put("/:id", upload.single('imagem'), checarPermissao,SeriesController.updateSeries);
routerSeries.delete("/:id", checarPermissao,SeriesController.deleteSeries);
routerSeries.get("/:id", checarPermissao,SeriesController.visualizeSeriesById);
routerSeries.get("/search/:nome", checarPermissao,SeriesController.searchSeriesByName);

export default routerSeries;
