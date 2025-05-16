import Usuario from '../models/UsuarioModel.js';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    constructor() {
        // Inicialização, se necessário
    }

    static async login (req, res){
        try {
            const { email, senha } = req.body;

            // Verificação de campos obrigatórios
            if (!email || !senha) {
                return res.status(400).json({ msg: 'Usuário e senha são obrigatórios.' });
            }

            // Verifica se o usuário existe
            const user = await Usuario.findByEmail(email);

            if (!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.' });
            }

            // Verifica a senha
            const confirmaSenha = await bcrypt.compare(senha, user.senha);
            if (!confirmaSenha) {
                return res.status(401).json({ msg: 'Senha inválida.' });
            }

            // Verifica se é funcionário (cargo != null)
            let isFuncionario = false;

            if(pessoa.pessoa_cargo!=null)
                isFuncionario = true;

            // Gera o token JWT com tempo de expiração e nível de permissão i love u babe
            const secret = process.env.SECRET;
            const token = jwt.sign({ id: user.id, isFuncionario }, secret, { expiresIn: '5h' });

            res.status(200).json({ msg: 'Login realizado com sucesso.', token, isFuncionario, id: user.id});

        } catch (erro) {
            console.error('Erro no login:', erro);
            res.status(500).json({ msg: 'Erro interno no servidor.' });
        }
    };
}

export default LoginController 