const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Headers, Request, Response } = require('node-fetch');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
}

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor!');
});

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// ROTA POST: Para inserir uma nova instituição
app.post('/instituicao', async (req, res) => {
    console.log("Corpo recebido:", req.body);

    // 1. Pegamos os dados. 
    // Se o Postman envia "Endereço", acessamos usando a string para evitar erro de sintaxe
    const Nome = req.body.Nome;
    const CNPJ = req.body.CNPJ;
    const Endereco = req.body['Endereço']; // Acessa a chave com acento e guarda numa variável sem acento
    const CEP = req.body.CEP;
    const Telefone = req.body.Telefone;

    // 2. Verificamos se todos os campos foram preenchidos
    if (!Nome || !CNPJ || !Endereco || !CEP || !Telefone) {
        return res.status(400).json({ error: 'Nome, CNPJ, Endereco, CEP e Telefone são obrigatórios' });
    }

    // 3. Inserimos no Supabase
    // MUITA ATENÇÃO: As chaves à esquerda (Nome, CNPJ...) devem ser IGUAIS às colunas no banco.
    const { data, error } = await supabase
        .from('Instituições')
        .insert([{
            Nome: Nome,
            CNPJ: CNPJ,
            "Endereço": Endereco, // Verifique se no Supabase a coluna tem acento ou não!
            CEP: CEP,
            Telefone: Telefone
        }]);

    if (error) {
        console.log("Erro do Supabase:", error);
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Instituição inserida com sucesso', data });
});
// ROTA GET: Para listar as instituições
app.get('/instituicao', async (req, res) => {
    const { data, error } = await supabase
        .from('Instituições')
        .select('*'); // No GET usamos .select('*') para buscar os dados

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data); // Retornamos os dados que vieram do banco
});

app.delete('/instituicao/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('Instituições')
        .delete()
        .eq('id', id); // Filtra pelo ID da linha

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Excluído com sucesso!' });
});

// ROTA PUT: Editar dados de uma instituição
app.put('/instituicao/:id', async (req, res) => {
    const { id } = req.params;
    const { Nome, CNPJ, Endereço, CEP, Telefone } = req.body;

    const { data, error } = await supabase
        .from('Instituições')
        .update({
            Nome,
            CNPJ,
            "Endereço": Endereço,
            CEP,
            Telefone
        })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Atualizado com sucesso!', data });
});

module.exports = app;