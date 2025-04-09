const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Rotas para cliente
router.get('/cliente', controller.cliente.getAllUsers);
router.get('/cliente/:id', controller.cliente.getUserById);
router.post('/cliente', controller.cliente.createUser);
router.post('/cliente/login', controller.cliente.login);
router.put('/cliente/:id', controller.cliente.updateUser);
router.delete('/cliente/:id', controller.cliente.deleteUser);

// Rotas para projeto
router.get('/projeto', controller.projeto.getAllProjeto);
router.get('/projeto/:id', controller.projeto.getProjetoByIdUser);
router.post('/projeto', controller.projeto.saveProjeto);
router.post("/projeto/projetoexiste", controller.projeto.projetoExiste);
router.put('/projeto', controller.projeto.updateProjeto);

// Rotas para usuário
router.post('/usuario', controller.usuario.createUsuario);
router.get('/usuario/:id', controller.usuario.getUsuarioById);
router.get('/usuario/email/:email', controller.usuario.getUsuarioByEmail);
router.delete('/usuario/:id', controller.usuario.excluirUsuario);

module.exports = router;