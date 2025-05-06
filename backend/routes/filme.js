import express from 'express';
import FilmesController from '../controllers/FilmesController.js';


const routerFilme = express.Router();

routerFilme.get('/', FilmesController.visualizeFilmes);
routerFilme.post('/', FilmesController.createFilme);
routerFilme.put('/:id', FilmesController.updateFilme);
routerFilme.delete('/:id', FilmesController.deleteFilme);
routerFilme.get('/:id', FilmesController.visualizeFilmeById);
routerFilme.get('/search/:nome', FilmesController.searchFilmeByName);

export default routerFilme;