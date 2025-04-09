const { Sequelize } = require("sequelize");

usuarioRoot = "root";  // trocar
nomeDoBanco = "desing_data";  // trocar
host = "localhost";
senha = "1234";  // trocar

const sequelize = new Sequelize(nomeDoBanco, usuarioRoot, "", {
  host: host,
  password: senha,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(function () {
    console.log("Conexão realizada com susesso");
  })
  .catch(function () {
    console.log("erro na conexão");
  });

module.exports = sequelize;