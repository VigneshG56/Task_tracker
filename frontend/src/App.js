import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask,deleteTask,updateTask} from './api';
import './App.css'; // Import your CSS styling 



function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // Load all tasks when the component mounts
  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Handle form submit to add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await createTask({ title: newTitle });
      setTasks([...tasks, res.data]);
      setNewTitle('');
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };  
  //  handle for deleting task
  const handleDelete = async (id) => {
  try {
    await deleteTask(id); // API call
    setTasks(tasks.filter(task => task.id !== id)); // update UI
  } catch (error) {
    console.error('Error deleting task:', error.message);
  }
};  

// handling update task
const handleToggleComplete = async (id, currentStatus) => {
  try {
    const updated = await updateTask(id, { completed: !currentStatus });

    // Update the task in state
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: updated.data.task.completed } : task
    ));
  } catch (error) {
    console.error('Error updating task:', error.message);
  }
};



  return (
    <div className="app-container">
      <h1 className="app-title">Task Tracker 📝</h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
nhh

          className="task-input"
        />
        <button type="submit" className="task-button">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p style={{ marginTop: '2rem', textAlign: 'center' }}>No tasks found.</p>
      ) : (
       <ul className="task-list">
  {tasks.map(task => (
    <li key={task.id} className="task-item">
      <span>{task.title}</span>

      {/*  Make this clickable */}
      <span
        style={{ cursor: 'pointer', marginLeft: '10px' }}
        onClick={() => handleToggleComplete(task.id, task.completed)}



      >
        {task.completed ? '✅' : '❌'}
      </span>

      {/*  Delete Button */}
      <button
        onClick={() => handleDelete(task.id)}
        className="delete-btn"
      >
        Delete
      </button>
    </li>
  ))}
</ul>


      )}
    </div>
  );
}

export default App;



