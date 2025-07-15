const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({ title,dueDate,userId: req.user.id, });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}; 

// get all task 

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}; 


  
// Delete task only if it belongs to the logged-in user
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update task only if it belongs to the logged-in user
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const { title, completed, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json({ message: 'Task updated', task });
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};







module.exports = { createTask ,getAllTasks,deleteTask,updateTask};




    
