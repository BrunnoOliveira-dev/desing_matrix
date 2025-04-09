const { Sequelize } = require('sequelize');


// Configuração para usar o Transaction Pooler do Supabase
const sequelize = new Sequelize('postgres', 'postgres.cpohawdcarjsqihblabr', 'umasenhasegura', {
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Defina como true se estiver utilizando certificados válidos
    },
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

module.exports = sequelize;