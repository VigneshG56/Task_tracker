const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}; 

// get all task 

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();  // Fetch all rows
    res.status(200).json(tasks);         // Send as JSON
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};  
//  Delete task by ID
const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;  // Get ID from URL

    // Check if task exists
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await task.destroy(); 

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update task (mark as complete/incomplete)
const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { completed } = req.body;

    const task = await Task.findByPk(id);  // Find task by ID

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }   

        if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Completed must be true or false' });
    }

    task.completed = completed;
    await task.save();


    

    // Update the completed status
    task.completed = completed;
    await task.save();

    res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};





module.exports = { createTask ,getAllTasks,deleteTask,updateTask};




    
