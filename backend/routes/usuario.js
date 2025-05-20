import express from 'express';
import multer from 'multer';
import path from 'path';
import UsuarioController from '../controllers/UsuarioController.js';
import __dirname from '../utils/pathUtils.js'; // Make sure to import this
import  {checarPermissao}  from '../middlewares/authMiddleware.js';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../ember/uploads')); // Adjust path as needed
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

const routerUsuario = express.Router();

routerUsuario.get('/',UsuarioController.visualizeUsuarios);
routerUsuario.get('/:id', checarPermissao,UsuarioController.findUsuarioById);
// Apply upload middleware to routes handling file uploads
routerUsuario.post('/', upload.single('imagem'), checarPermissao,UsuarioController.createUsuario); // For file uploads
routerUsuario.put('/:id', upload.single('imagem'), checarPermissao,UsuarioController.updateUsuario); // For file uploads
routerUsuario.delete('/:id', checarPermissao,UsuarioController.deleteUsuario);
routerUsuario.get('/email/:email', checarPermissao,UsuarioController.findUsuarioByEmail);
routerUsuario.get('/exists/:email', checarPermissao,UsuarioController.existsUsuario);

export default routerUsuario;