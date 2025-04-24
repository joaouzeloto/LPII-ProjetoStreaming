import multer from 'multer';
import path from 'path';

// Configuração para onde a imagem será salva
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Salvar na pasta 'uploads'
    },
    filename: function (req, file, cb) {
        // Nome único para cada arquivo baseado no timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export { upload };