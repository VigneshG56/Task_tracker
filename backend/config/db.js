const { Sequelize } = require('sequelize');
require('dotenv').config();

//creating sequelize instance using env variables
const sequelize = new Sequelize(
    process.env.DB_NAME,  // database name
    process.env.DB_USER,  // database username
    process.env.DB_PASSWORD, // db pw
    {
        host: process.env.DB_HOST,
        dialect: 'postgres', // bcos we use psql
        port: process.env.DB_PORT,  // usual 5432 port
        logging: false  // dont show sql log in terminal
        
    }
);

//func to test db connection 
const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('psql conected successfully');
    } catch (error){
        console.log('unable to connect:',error.message);
    }
};

// export seqelize and connect function
module.exports = { sequelize, connectDB};