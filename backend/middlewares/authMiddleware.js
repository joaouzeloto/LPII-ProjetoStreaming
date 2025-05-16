const jwt = require('jsonwebtoken');

// Middleware genérico de autenticação
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token inválido: ' + error });
  }
};

// Middleware para verificar se é colaborador
exports.checarColaborador = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);

    const pessoa = await Pessoa.findById(decoded.id);
    if (!pessoa) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const colaborador = await Colaborador.findOne({ Pessoa_pessoa_id: pessoa._id });
    if (!colaborador) {
      return res.status(403).json({ msg: "Acesso restrito a colaboradores" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ msg: "Erro no servidor" });
  }
};

// Middleware para verificar permissão
exports.checarPermissao = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);

    // Verifica se é funcionário e define a permissão no objeto de requisição
    req.isFuncionario = decoded.isFuncionario;
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token inválido: ' + error });
  }
};
