import express from 'express';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

//Middlewares
const decodedDir = decodeURIComponent(__dirname);
const staticMiddleware = express.static(path.join(decodeURIComponent(__dirname), 'assets'));

const urlencodedMiddleware = express.urlencoded({ extended: true });
const jsonMiddleware = express.json();

const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*"],
            scriptSrc: ["*", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["*", "'unsafe-inline'"],
            imgSrc: ["*", "data:"],
            connectSrc: ["*"],
            fontSrc: ["*"],
            objectSrc: ["*"],
            mediaSrc: ["*"],
            frameSrc: ["*"]
        }
    }
});

const compressionMiddlewware = compression();

const rateLimitMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutos
    max: 100,                  // Limita cada IP a 50 requisições por janela
    message: 'Muitas requisições, tente novamente em 10 minutos.'
});

const logFile = fs.createWriteStream(path.join(decodeURIComponent(__dirname), 'access.log'), { flags: 'a' });
const morganMiddleware = morgan('combined', { stream: logFile });

export {
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddlewware,
    rateLimitMiddleware,
    morganMiddleware
};

