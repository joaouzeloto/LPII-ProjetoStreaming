import __dirname from '../utils/pathUtils.js';
import Usuario from '../models/UsuarioModel.js';

class UsuarioController {
    static async createUsuario(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const usuario = new Usuario(nome, email, senha);
            await usuario.save();
            res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error) {
            console.error('Erro ao criar o usuário:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async visualizeUsuarios(req, res) {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao visualizar os usuários:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha } = req.body;
            const usuario = new Usuario(nome, email, senha);
            await Usuario.update(id, usuario);
            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar o usuário:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            await Usuario.delete(id);
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar o usuário:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async findUsuarioById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findById(id);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao encontrar o usuário:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async findUsuarioByEmail(req, res) {
        try {
            const { email } = req.params;
            const usuario = await Usuario.findByEmail(email);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao encontrar o usuário:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async existsUsuario(req, res) {
        try {
            const { email } = req.params;
            const usuario = await Usuario.exists(email);
            if (usuario) {
                res.status(200).json({ message: 'Usuário existe' });
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao verificar a existência do usuário:', error);
            res.status(500).send('Erro interno');
        }
    }
}

export default UsuarioController;