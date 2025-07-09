const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// define task model
const Task = sequelize.define('Task',{
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}); 

//Export the model
module.exports = Task; 