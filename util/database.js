// Connect To My SQL Database 
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'book-store',
//     password: '35710944'
// });
// module.exports = pool.promise();
// Connect Sequelize 



const Sequelize = require('sequelize');
const sequelize = new Sequelize('book-store', 'root', 'ahmedsayed', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;


