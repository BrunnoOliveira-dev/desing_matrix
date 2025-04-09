const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Projeto = sequelize.define(
  "Projeto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // Nome da tabela referenciada
        key: "idUsuario",
      },
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    }
  },
  {
    tableName: "projetos",
    timestamps: true,
  }
);

module.exports = Projeto;