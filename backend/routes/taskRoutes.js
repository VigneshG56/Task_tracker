
const express = require('express');
const router = express.Router();
const { createTask , getAllTasks ,deleteTask,updateTask } = require('../controllers/taskController');

// Console to check if route file is loaded
console.log(" taskRoutes.js loaded ");

// Route to create a new task with debug log
router.post('/tasks', (req, res, next) => {
  console.log(" POST /api/tasks route was triggered");
  next(); // pass control to createTask()
}, createTask); 


// route to get the all tasks

router.get('/tasks',(req, res, next) =>{
  console.log("Fetched all tasks");
  next();
},getAllTasks);  

// route to delete paticular task by its id

router.delete('/tasks/:id', (req, res, next) => {
  console.log(" DELETE /api/tasks/:id ");
  next();
}, deleteTask); 

// route to updat the task

router.put('/tasks/:id', (req,res, next) =>{
  console.log("Put /api/tasks/:id ");
  next();
},updateTask);  





module.exports = router;
