const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// ✅ SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ROTA POST: Para inserir uma nova instituição
app.post('/api/instituicao', async (req, res) => {
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

// ROTA GET: Para listar as instituições
app.get('/api/instituicao', async (req, res) => {
    const { data, error } = await supabase
        .from('Instituições')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
});

// ROTA DELETE
app.delete('/api/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('Instituições')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Excluído com sucesso!' });
});

// ROTA PUT
app.put('/api/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    const { data, error } = await supabase
        .from('Instituições')
        .update({ Nome, CNPJ, Endereço, CEP, Telefone })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Atualizado com sucesso!', data });
});

module.exports = app;