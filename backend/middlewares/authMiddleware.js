import jwt from 'jsonwebtoken';
import Usuario from '../models/UsuarioModel.js';

// Middleware genérico de autenticação
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }
  
  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    
    // Adiciona o ID do usuário no request para uso em outros middlewares
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token inválido: ' + error });
  }
};

// Middleware para verificar se é colaborador (admin)
export const checarColaborador = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }
  
  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    
    // Busca o usuário pelo ID armazenado no token
    const usuario = await Usuario.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    
    // Verifica se o usuário tem role 'admin'
    if (usuario.role !== 'admin') {
      return res.status(403).json({ msg: "Acesso restrito a administradores" });
    }
    
    // Se o usuário é admin, adiciona essa informação ao request
    req.isAdmin = true;
    req.usuario = usuario;
    
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Erro no servidor: " + error });
  }
};

// Middleware para verificar permissão e adicionar informações do usuário ao request
export const checarPermissao = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }
  
  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    
    // Busca o usuário pelo ID armazenado no token
    const usuario = await Usuario.findById(decoded.id);
    
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    
    // Adiciona informações ao objeto request
    req.usuario = usuario;
    req.role = usuario.role;
    req.isAdmin = usuario.role === 'admin';
    
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token inválido: ' + error });
  }
};

// Exporta todos os middlewares como objeto default
export default {
  authMiddleware,
  checarColaborador,
  checarPermissao
};