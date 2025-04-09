const clienteController = require('./cliente');
const projetoController = require('./projeto');
const usuarioController = require('../models/usuarioController');

module.exports = {
  cliente: clienteController,
  projeto: projetoController,
  usuario: usuarioController,
};