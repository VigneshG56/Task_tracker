const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
} = require('../controllers/taskController');

const authenticateToken = require('../middleware/authMiddleware'); //  Protect routes

console.log("taskRoutes.js loaded");

// Route to create a new task
router.post('/tasks', authenticateToken, (req, res, next) => {
  console.log("POST /api/tasks route was triggered");
  next();
}, createTask);

// Route to get all tasks
router.get('/tasks', authenticateToken, (req, res, next) => {
  console.log("GET /api/tasks");
  next();
}, getAllTasks);

// Route to delete a task
router.delete('/tasks/:id', authenticateToken, (req, res, next) => {
  console.log("DELETE /api/tasks/:id");
  next();
}, deleteTask);

// Route to update a task
router.put('/tasks/:id', authenticateToken, (req, res, next) => {
  console.log("PUT /api/tasks/:id");
  next();
}, updateTask);

module.exports = router;
