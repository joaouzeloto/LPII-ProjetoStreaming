import __dirname from '../utils/pathUtils.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import Usuario from '../models/UsuarioModel.js';

const SALT_ROUNDS = 10;

class UsuarioController {
    static async createUsuario(req, res) {
    try {
        console.log('Criando usuário...');
        const { nome, email, dtNascimento, apelido, senha, role } = req.body;
        const endereco = req.body.endereco;
        const caminho = req.file ? req.file.filename : undefined;

        // Validações (mantendo as existentes)
        if (!nome || !email || !senha || !dtNascimento) {
            return res.status(400).json({ message: 'Campos nome, dtNascimento, email e senha são obrigatórios' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email inválido' });
        }
        if (senha.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter ao menos 6 caracteres' });
        }
        
        // Validação da role
        const validRoles = ['admin', 'user'];
        const userRole = role || 'user'; // default: 'user'
        
        if (!validRoles.includes(userRole)) {
            return res.status(400).json({ message: 'Role inválida. Deve ser "admin" ou "user"' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

        // Processamento do endereço (código existente)
        let enderecoFormatado = endereco;
        if (typeof endereco === 'string') {
            try {
                enderecoFormatado = JSON.parse(endereco);
            } catch (e) {
                // Se não for um JSON válido, mantém o valor original
                console.error('Erro ao fazer parsing do endereço:', e);
            }
        }
        
        // Se for um objeto, converte para string formatada
        if (typeof enderecoFormatado === 'object' && enderecoFormatado !== null) {
            const { cep, rua, numero, bairro, complemento, cidade, estado } = enderecoFormatado;
            enderecoFormatado = `${rua}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro} - ${cidade}/${estado} - CEP: ${cep}`;
        }

        // Criar instância da classe Usuario com role
        const usuario = new Usuario(nome, new Date(dtNascimento), apelido, caminho, enderecoFormatado, userRole);
        // Adicionar email e senha manualmente
        usuario.email = email;
        usuario.senha = hashedPassword;
        
        // Salvar usando o método da classe wrapper
        const novoUsuario = await usuario.save();

        console.log('Usuário criado com sucesso:', novoUsuario);
        return res.status(201).json({ 
            message: 'Usuário criado com sucesso',
            usuario: {
                _id: novoUsuario._id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                role: novoUsuario.role
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
            console.log('Usuários encontrados:', usuarios);
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

        const { nome, dtNascimento, apelido, email, senha, endereco, role } = req.body;
        const updates = {};

        // Adicionar apenas os campos fornecidos (mantendo validações existentes)
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
        
        // Validação e atualização da role
        if (role) {
            const validRoles = ['admin', 'user'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: 'Role inválida. Deve ser "admin" ou "user"' });
            }
            updates.role = role;
        }
        
            
            // Processar endereço se fornecido
            if (endereco) {
                let enderecoFormatado = endereco;
                if (typeof endereco === 'string') {
                    try {
                        enderecoFormatado = JSON.parse(endereco);
                    } catch (e) {
                        // Se não for um JSON válido, mantém o valor original
                    }
                }
                
                // Se for um objeto, converte para string formatada
                if (typeof enderecoFormatado === 'object' && enderecoFormatado !== null) {
                    const { cep, rua, numero, bairro, complemento, cidade, estado } = enderecoFormatado;
                    enderecoFormatado = `${rua}, ${numero}${complemento ? `, ${complemento}` : ''} - ${bairro} - ${cidade}/${estado} - CEP: ${cep}`;
                }
                
                updates.endereco = enderecoFormatado;
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

            // Usar método da classe
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

            const usuario = await Usuario.findById(id);
            
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Se houver endereço, tenta fazer o parsing para objeto
            if (usuario.endereco) {
                try {
                    // Tenta extrair as partes do endereço
                    const enderecoRegex = /^(.+),\s*(\d+)(?:,\s*(.+))?\s*-\s*(.+)\s*-\s*(.+)\/(.+)\s*-\s*CEP:\s*(.+)$/;
                    const match = usuario.endereco.match(enderecoRegex);
                    
                    if (match) {
                        usuario._doc.enderecoObj = {
                            rua: match[1],
                            numero: match[2],
                            complemento: match[3] || '',
                            bairro: match[4],
                            cidade: match[5],
                            estado: match[6],
                            cep: match[7]
                        };
                    }
                } catch (e) {
                    console.error('Erro ao fazer parsing do endereço:', e);
                }
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

            const usuario = await Usuario.findByEmail(email);
            
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Se houver endereço, tenta fazer o parsing para objeto
            if (usuario.endereco) {
                try {
                    // Tenta extrair as partes do endereço
                    const enderecoRegex = /^(.+),\s*(\d+)(?:,\s*(.+))?\s*-\s*(.+)\s*-\s*(.+)\/(.+)\s*-\s*CEP:\s*(.+)$/;
                    const match = usuario.endereco.match(enderecoRegex);
                    
                    if (match) {
                        usuario._doc.enderecoObj = {
                            rua: match[1],
                            numero: match[2],
                            complemento: match[3] || '',
                            bairro: match[4],
                            cidade: match[5],
                            estado: match[6],
                            cep: match[7]
                        };
                    }
                } catch (e) {
                    console.error('Erro ao fazer parsing do endereço:', e);
                }
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

            // Verificar a existência usando countDocuments
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