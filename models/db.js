const { Sequelize } = require('sequelize')

const sequelize = new Sequelize("desing_data", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(function() {
    console.log("Conexão realizada com susesso")
}).catch(function() {
    console.log("erro na conexão")
})

module.exports = sequelize;