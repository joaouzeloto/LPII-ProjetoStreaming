import Usuario from '../models/UsuarioModel.js';
import bcrypt from 'bcryptjs'
import jwt  from 'jsonwebtoken'

class LoginController {
    constructor() {
        // Inicialização, se necessário
    }

    static async login(req, res) {
    try {
        const { email, senha } = req.body;

        // Verificação de campos obrigatórios
        if (!email || !senha) {
            return res.status(400).json({ msg: 'Usuário e senha são obrigatórios.' });
        }

        // Verifica se o usuário existe
        const usuario = await Usuario.findByEmail(email);

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        // Verifica a senha
        const confirmaSenha = await bcrypt.compare(senha, usuario.senha);
        if (!confirmaSenha) {
            return res.status(401).json({ msg: 'Senha inválida.' });
        }

        // Verifica se é funcionário (agora baseado na role sendo 'admin')
        let isFuncionario = usuario.role === 'admin';

        // Gera o token JWT com tempo de expiração e nível de permissão
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: usuario._id, isFuncionario }, secret, { expiresIn: '5h' });

        // Retorna exatamente a mesma estrutura do exemplo original
        res.status(200).json({ 
            msg: 'Login realizado com sucesso.', 
            token, 
            isFuncionario, 
            pessoa_id: usuario._id
        });

    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ msg: 'Erro interno no servidor.' });
    }
}
}

export default LoginController 