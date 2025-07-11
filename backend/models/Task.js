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
    },
    dueDate: {
    type: DataTypes.DATE,
    allowNull: true, // User can optionally skip due date
  },
}); 

//Export the model
module.exports = Task; 