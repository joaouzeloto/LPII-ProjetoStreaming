import __dirname from '../utils/pathUtils.js';
import Conta from '../models/ContaModel.js';
import e from 'express';

class ContaController {
    static async createConta(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const conta = new Conta(nome, email, senha);
            await conta.save();
            res.status(201).json({ message: 'Conta criada com sucesso' });
        } catch (error) {
            console.error('Erro ao criar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async visualizeContas(req, res) {
        try {
            const contas = await Conta.findAll();
            res.status(200).json(contas);
        } catch (error) {
            console.error('Erro ao visualizar as contas:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async updateConta(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha } = req.body;
            const conta = new Conta(nome, email, senha);
            await Conta.update(id, conta);
            res.status(200).json({ message: 'Conta atualizada com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async deleteConta(req, res) {
        try {
            const { id } = req.params;
            await Conta.delete(id);
            res.status(200).json({ message: 'Conta deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async findContaById(req, res) {
        try {
            const { id } = req.params;
            const conta = await Conta.findById(id);
            if (conta) {
                res.status(200).json(conta);
            } else {
                res.status(404).json({ message: 'Conta não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao encontrar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async findContaByEmail(req, res) {
        try {
            const { email } = req.params;
            const conta = await Conta.findByEmail(email);
            if (conta) {
                res.status(200).json(conta);
            } else {
                res.status(404).json({ message: 'Conta não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao encontrar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async findContaByName(req, res) {
        try {
            const { nome } = req.params;
            const contas = await Conta.findByName(nome);
            res.status(200).json(contas);
        } catch (error) {
            console.error('Erro ao encontrar a conta:', error);
            res.status(500).send('Erro interno');
        }
    }
}

export default ContaController;

