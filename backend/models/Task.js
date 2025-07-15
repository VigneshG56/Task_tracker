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
   userId: { //  Added to associate task with user .. so every taask should comes under userid
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}); 

//Export the model
module.exports = Task; 