const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


const db = require('./models/db.js')
const usuarioController = require('./models/usuarioController.js');

app.use(express.json())
app.use(express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "Login.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Cadastro.html"))
})

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Perfil.html"))
})

app.get('/projeto', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Projeto.html"))
})

app.get('/criacao', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "Criacao.html"))
})

app.post('/cadastro', async (req, res) => {
  const { userName, email, senha } = req.body;

  try {
    // Verificar se todos os campos foram preenchidos
    if (!userName || !email || !senha) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    // Criar novo usuário no banco de dados
    const novoUsuario = await usuarioController.createUsuario({ userName, email, senha });

    // Retornar sucesso
    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: novoUsuario
    });
  } catch (error) {
    // Retornar erro
    res.status(500).json({
      message: "Erro ao cadastrar usuário",
      error: error.message
    });
  }
});

 
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
