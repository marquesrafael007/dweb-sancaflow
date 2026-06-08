const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ============ Funções ===========================================
async function inserirTabela(nomeTabela, dados){ 
    const { data, error } = await supabase
        .from(nomeTabela)
        .insert([dados]);
    if (error) throw error;

    return data;
}

async function lerTabela(nomeTabela){
 const { data, error } = await supabase
            .from(nomeTabela)
            .select('*');

        if (error) throw error;
	return data;
}

async function atualizarTabela(nomeTabela, id, novosDados){
 const { data, error } = await supabase
        .from(nomeTabela)
        .update(novosDados)
        .eq('id', id)
        .select();

    if (error) throw error;

    return data;
}

async function deletarTabela(nomeTabela, id){
const { data, error } = await supabase
        .from(nomeTabela)
        .delete()
        .eq('id', id)
        .select();

    if (error) throw error;

    return data;
}
//=================================================================

// Router para API
const apiRouter = express.Router();

// Rota GET para listar instituições (quando não há ID específico)
apiRouter.get('/instituicao', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Instituições')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.error('Erro ao carregar instituições:', e);
        res.status(500).json({ error: e.message });
    }
});

// ROTA POST: Para inserir uma nova instituição
apiRouter.post('/instituicao', async (req, res) => {
    console.log("Corpo recebido:", req.body);

    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    if (!Nome || !CNPJ || !Endereço || !CEP || !Telefone) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const { data, error } = await supabase
        .from('Instituições')
        .insert([{ Nome, CNPJ, Endereço, CEP, Telefone }]);

    if (error) {
        console.log("Erro do Supabase:", error);
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Instituição inserida com sucesso', data });
});

// ROTA DELETE
apiRouter.delete('/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Instituições')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Excluído com sucesso!' });
});

// ROTA PUT
apiRouter.put('/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    const { data, error } = await supabase
        .from('Instituições')
        .update({ Nome, CNPJ, Endereço, CEP, Telefone })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Atualizado com sucesso!', data });
});

// Usar o router para todas as rotas da API
app.use('/api', apiRouter);

// A rota raiz foi removida daqui para permitir que a Vercel sirva o index.html automaticamente.

// Listener para desenvolvimento local
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
// ============== Eventos =========================
//-------------------CREATE ------------------------
apiRouter.post('/eventos', async(req, res) => {
try {
    const resultado = await inserirTabela(
        'eventos',
        req.body
    );
    res.status(201).json(resultado);
} catch (e) {
    res.status(500).json({error: e.message});
}
});
//------------------ READ --------------------------
apiRouter.get('/eventos', async (req, res) => {
    try {
        const dados = await lerTabela('eventos');
        res.status(200).json(dados);
    } catch (e) {
        console.log("Erro ao carregar eventos:", e);
        res.status(500).json({ error: e.message });
    }
});
//----------------- UPDATE -------------------------
apiRouter.put('/eventos/:id', async (req, res) => {
    try {
        const resultado = await atualizarTabela(
            'eventos',
            req.params.id,
            req.body
        );

        res.status(200).json(resultado);

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
//----------------- DELETE ------------------------
apiRouter.delete('/eventos/:id', async (req, res) => {
    try {
        const resultado = await deletarTabela(
            'eventos',
            req.params.id
        );

        res.status(200).json({
            message: 'Evento excluído com sucesso!',
            data: resultado
        });

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
// ================================================

// ============== Locais ==========================
//-------------------CREATE ------------------------
apiRouter.post('/locais', async(req, res) => {
    try {
        const resultado = await inserirTabela(
            'locais',
            req.body
        );
        res.status(201).json(resultado);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});
//------------------ READ --------------------------
apiRouter.get('/locais', async (req, res) => {
    try {
        const dados = await lerTabela('locais');
        res.status(200).json(dados);
    } catch (e) {
        console.log("Erro ao carregar locais:", e);
        res.status(500).json({ error: e.message });
    }
});
//----------------- UPDATE -------------------------
apiRouter.put('/locais/:id', async (req, res) => {
    try {
        const resultado = await atualizarTabela(
            'locais',
            req.params.id,
            req.body
        );
        res.status(200).json(resultado);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
//----------------- DELETE ------------------------
apiRouter.delete('/locais/:id', async (req, res) => {
    try {
        const resultado = await deletarTabela(
            'locais',
            req.params.id
        );
        res.status(200).json({
            message: 'Local excluído com sucesso!',
            data: resultado
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});
// ================================================

module.exports = app;
