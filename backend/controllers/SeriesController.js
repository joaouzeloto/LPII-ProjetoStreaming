import __dirname from '../utils/pathUtils.js';
import path from 'path';
import Series from '../models/Series.js';

class SeriesController {

    //Implementação dos Renders das Páginas WEB
    static async renderCreateSeries(req, res) {
        try {
            res.sendFile(path.join(__dirname, 'views', 'cadastrar-series.html'));
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async renderVisualizeSeries(req, res) {
        try {
            const series = await Series.findAll();
            res.render('visualizar-series', { series });
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async createSeries(req, res) {
        try {
            const { nome, genero, sinopse, anoLancamento, duracao, temporadas, episodios } = req.body;

            // Obtém o caminho da imagem do upload (se houver)
            const imagemPath = req.file ? req.file.filename : null;

            const series = new Series(
                nome,
                genero,
                sinopse,
                anoLancamento,
                duracao,
                imagemPath, // Adicionar o caminho da imagem
                temporadas,
                episodios
            );
            await series.save();
            res.status(201).json({ message: 'Série criada com sucesso' });
        } catch (error) {
            console.error('Erro ao criar a série:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async visualizeSeries(req, res) {
        try {
            const series = await Series.findAll();
            res.status(200).json(series);
        } catch (error) {
            console.error('Erro ao visualizar as séries:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async updateSeries(req, res) {
        try {
            const { id } = req.params;
            const { nome, genero, sinopse, anoLancamento, duracao, temporadas, episodios } = req.body;

            // Obtém o caminho da imagem do upload (se houver)
            const imagemPath = req.file ? req.file.filename : null;

            const series = new Series(
                nome,
                genero,
                sinopse,
                anoLancamento,
                duracao,
                imagemPath, // Adicionar o caminho da imagem
                temporadas,
                episodios
            );
            await Series.update(id, series);
            res.status(200).json({ message: 'Série atualizada com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar a série:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async deleteSeries(req, res) {
        try {
            const { id } = req.params;
            await Series.delete(id);
            res.status(200).json({ message: 'Série excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir a série:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async renderUpdateSeries(req, res) {
        try {
            const { id } = req.params;
            const series = await Series.findById(id);
            res.render('atualizar-series', { series });
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            res.status(500).send('Erro interno');
        }
    }

    static async renderDeleteSeries(req, res) {
        try {
            const { id } = req.params;
            const series = await Series.findById(id);
            res.render('excluir-series', { series });
        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            res.status(500).send('Erro interno');
        }
    }

}
