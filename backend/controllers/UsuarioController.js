import __dirname from '../utils/pathUtils.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import Usuario from '../models/UsuarioModel.js';

const SALT_ROUNDS = 10;

class UsuarioController {
    static async createUsuario(req, res) {
        try {
            console.log('Criando usuário:', req.body);
            console.log('Arquivo enviado:', req.file);
            
            const { nome, email, dtNascimento, apelido, senha } = req.body;
            const caminho = req.file ? req.file.filename : undefined;

            // Validações
            if (!nome || !email || !senha || !dtNascimento) {
                return res.status(400).json({ message: 'Campos nome, dtNascimento, email e senha são obrigatórios' });
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Email inválido' });
            }
            if (senha.length < 6) {
                return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

            // Criar instância da classe Usuario
            const usuario = new Usuario(nome, new Date(dtNascimento), apelido, caminho);
            // Adicionar email e senha manualmente, já que não estão no construtor
            usuario.email = email;
            usuario.senha = hashedPassword;
            
            // Salvar usando o método da classe wrapper
            const novoUsuario = await usuario.save();

            return res.status(201).json({ 
                message: 'Usuário criado com sucesso',
                usuario: {
                    _id: novoUsuario._id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                }
            });
        } catch (error) {
            console.error('Erro ao criar o usuário:', error);
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(409).json({ message: 'Email já cadastrado' });
            }
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async visualizeUsuarios(req, res) {
        try {
            const usuarios = await Usuario.findAll();
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao visualizar os usuários:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID de usuário inválido' });
            }

            console.log('Atualizando usuário:', req.body);
            console.log('Arquivo enviado:', req.file);

            const { nome, dtNascimento, apelido, email, senha } = req.body;
            const updates = {};

            // Adicionar apenas os campos fornecidos
            if (nome) updates.nome = nome;
            if (dtNascimento) {
                if (!validator.isDate(new Date(dtNascimento).toISOString().split('T')[0])) {
                    return res.status(400).json({ message: 'Data de nascimento inválida' });
                }
                updates.dtNascimento = new Date(dtNascimento);
            }
            if (apelido !== undefined) updates.apelido = apelido;
            if (email) {
                if (!validator.isEmail(email)) {
                    return res.status(400).json({ message: 'Email inválido' });
                }
                updates.email = email;
            }
            if (senha && senha.trim() !== '') {
                if (senha.length < 6) {
                    return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres' });
                }
                updates.senha = await bcrypt.hash(senha, SALT_ROUNDS);
            }
            
            // Adicionar caminho da imagem se foi enviado um arquivo
            if (req.file) {
                updates.caminho = req.file.filename;
            }

            // Usar o método update da classe wrapper
            const usuarioAtualizado = await Usuario.update(id, updates);

            if (!usuarioAtualizado) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json({ 
                message: 'Usuário atualizado com sucesso', 
                usuario: usuarioAtualizado 
            });
        } catch (error) {
            console.error('Erro ao atualizar o usuário:', error);
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(409).json({ message: 'Email já cadastrado' });
            }
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID de usuário inválido' });
            }

            // Usar findByIdAndDelete do Mongoose
            const usuarioDeletado = await Usuario.findByIdAndDelete(id);
            
            if (!usuarioDeletado) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar o usuário:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async findUsuarioById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID de usuário inválido' });
            }

            // Usar findById do Mongoose
            const usuario = await Usuario.findById(id);
            
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro ao encontrar o usuário:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async findUsuarioByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Email inválido' });
            }

            // Usar findOne do Mongoose
            const usuario = await Usuario.findOne({ email });
            
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro ao encontrar o usuário:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }

    static async existsUsuario(req, res) {
        try {
            const { email } = req.params;
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Email inválido' });
            }

            // Verificar a existência usando countDocuments do Mongoose
            const count = await Usuario.countDocuments({ email });
            
            if (count === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json({ message: 'Usuário existe' });
        } catch (error) {
            console.error('Erro ao verificar a existência do usuário:', error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }
}

export default UsuarioController;