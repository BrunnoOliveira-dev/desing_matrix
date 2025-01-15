const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Caminho correto para o arquivo de conexão

const Usuario = sequelize.define(
  'Usuario',
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
  },
  {
    tableName: 'usuario',
    timestamps: false,
  }
);

module.exports = Usuario;
