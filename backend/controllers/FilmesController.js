import __dirname from '../utils/pathUtils.js';
import Filmes from '../models/Filmes.js';

class FilmesController {
    static async createFilme(req, res) {
        try {
            const { nome, genero, sinopse, anoLancamento, duracao } = req.body;

            // Obtém o caminho da imagem do upload (se houver)
            const imagemPath = req.file ? req.file.filename : null;

            const filme = new Filmes(
                nome,
                genero,
                sinopse,
                anoLancamento,
                duracao,
                imagemPath // Adicionar o caminho da imagem
            );
            await filme.save();
            res.status(201).json({ message: 'Filme criado com sucesso' });
        } catch (error) {
            console.error('Erro ao criar o filme:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async visualizeFilmes(req, res) {
        try {
            const filmes = await Filmes.findAll();
            res.status(200).json(filmes);
        } catch (error) {
            console.error('Erro ao visualizar os filmes:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async updateFilme(req, res) {
        try {
            const { id } = req.params;
            const { nome, genero, sinopse, anoLancamento, duracao } = req.body;

            // Obtém o caminho da imagem do upload (se houver)
            const imagemPath = req.file ? req.file.filename : null;

            const filme = new Filmes(
                nome,
                genero,
                sinopse,
                anoLancamento,
                duracao,
                imagemPath // Adicionar o caminho da imagem
            );
            await Filmes.update(id, filme);
            res.status(200).json({ message: 'Filme atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar o filme:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async deleteFilme(req, res) {
        try {
            const { id } = req.params;
            await Filmes.delete(id);
            res.status(200).json({ message: 'Filme excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir o filme:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async visualizeFilmeById(req, res) {
        try {
            const { id } = req.params;
            const filme = await Filmes.findById(id);
            if (!filme) {
                return res.status(404).json({ message: 'Filme não encontrado' });
            }
            res.status(200).json(filme);
        } catch (error) {
            console.error('Erro ao visualizar o filme:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async searchFilmeByName(req, res) {
        try {
            const { nome } = req.params;
            const filmes = await Filmes.searchByName(nome);
            res.status(200).json(filmes);
        } catch (error) {
            console.error('Erro ao buscar filme:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async searchFilmeByGenre(req, res) {
        try {
            const { genero } = req.params;
            const filmes = await Filmes.searchByGenre(genero);
            res.status(200).json(filmes);
        } catch (error) {
            console.error('Erro ao buscar filme por gênero:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async searchFilmeByReleaseYear(req, res) {
        try {
            const { anoLancamento } = req.params;
            const filmes = await Filmes.searchByReleaseYear(anoLancamento);
            res.status(200).json(filmes);
        } catch (error) {
            console.error('Erro ao buscar filme por ano de lançamento:', error);
            res.status(500).send('Erro interno');
        }
    }
}

export default FilmesController;