const { where } = require("sequelize");
const Usuario = require("./User");

const createUsuario = async ({ userName, email, senha }) => {
  try {
    // Criar novo usuário no banco
    const novoUsuario = await Usuario.create({ userName, email, senha });
    return novoUsuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario)
      return res.status(404).json({ message: "usuario não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuarioByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario)
      return res.status(404).json({ message: "usuario não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await usuario.destroy();
    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUsuario,
  getUsuarioById,
  getUsuarioByEmail,
  excluirUsuario,
};