import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask,deleteTask,updateTask} from './api';
import './App.css'; // Import your CSS styling  


// Utility: check if task is overdue
const isOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;

  const today = new Date();
  const due = new Date(task.dueDate);

  // Compare only the date (ignore time)
  return due < today.setHours(0, 0, 0, 0);
};





function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); 
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');



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
      const res = await createTask({ title: newTitle,dueDate: dueDate,});
      setTasks([...tasks, res.data]);
      setNewTitle('');
      setDueDate('');
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

const startEditing = (task) => {
  setEditingId(task.id);
  setEditedTitle(task.title);
  setEditedDueDate(task.dueDate || '');
};

const handleSaveEdit = async (id) => {
  try {
    const updated = await updateTask(id, {
      title: editedTitle,
      dueDate: editedDueDate,
    });

    setTasks(tasks.map((task) =>
      task.id === id ? updated.data.task : task
    ));

    setEditingId(null);
    setEditedTitle('');
    setEditedDueDate('');
  } catch (error) {
    console.error('Error saving task edits:', error.message);
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


          className="task-input"
        /> 
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
      />

        <button type="submit" className="task-button">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p style={{ marginTop: '2rem', textAlign: 'center' }}>No tasks found.</p>
      ) : (
       <ul className="task-list">
  {tasks.map((task) => (
    <li
      key={task.id}
      className="task-item"
      style={{
        background: isOverdue(task)
          ? 'rgba(255, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.05)',
      }}
    >
      {editingId === task.id ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="task-input"
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="task-input"
          />
          <button
            onClick={() => handleSaveEdit(task.id)}
            className="task-button"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          {task.dueDate && (
            <span
              style={{
                marginLeft: '10px',
                fontSize: '0.9rem',
                color: '#ccc',
              }}
            >
              (Due: {new Date(task.dueDate).toLocaleDateString()})
            </span>
          )}
          {isOverdue(task) && (
            <span
              style={{
                color: '#ff4d4d',
                fontSize: '0.8rem',
                marginLeft: '10px',
              }}
            >
              ⚠️ Overdue!
            </span>
          )}
          <span
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            onClick={() =>
              handleToggleComplete(task.id, task.completed)
            }
          >
            {task.completed ? '✅' : '❌'}
          </span>
          <button
            onClick={() => handleDelete(task.id)}
            className="delete-btn"
          >
            Delete
          </button>
          <button
            onClick={() => startEditing(task)}
            className="task-button"
            style={{
              marginLeft: '10px',
              backgroundColor: '#444',
            }}
          >
            Edit
          </button>
        </>
      )}
    </li>
  ))}
</ul>



      )}
    </div>
  );
}

export default App;



