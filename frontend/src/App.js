import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask, updateTask } from './api';
import Login from './Login'; 
import Signup from './Signup'; 
import './App.css';

// Utility to check overdue
const isOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  const due = new Date(task.dueDate);
  return due < today.setHours(0, 0, 0, 0);
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [showSignup, setShowSignup] = useState(false); 

  //  Attach token to all axios requests when token changes
  useEffect(() => {
    if (token) {
      import('./api').then((api) => {
        api.default.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        loadTasks();
      });
    }
  }, [token]);

  //  Load tasks from backend
  const loadTasks = async () => {
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  //  Add task handler
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await createTask({ title: newTitle, dueDate });
      setTasks([...tasks, res.data]);
      setNewTitle('');
      setDueDate('');
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  //  Delete task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  // Toggle complete
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const updated = await updateTask(id, { completed: !currentStatus });
      setTasks(tasks.map(task =>
        task.id === id ? updated.data.task : task
      ));
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  // Start edit
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
    setEditedDueDate(task.dueDate || '');
  };

  //  Save edited task
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

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  //  Login/Signup Conditional UI
  if (!token) {
    return showSignup ? (
      <Signup onSignup={() => setShowSignup(false)} />
    ) : (
      <div>
        <Login onLogin={(tok) => setToken(tok)} />
        <p style={{ color: '#fff', textAlign: 'center' }}>
          Don’t have an account?{' '}
          <button onClick={() => setShowSignup(true)} style={{ color: 'skyblue' }}>
            Sign up
          </button>
        </p>
      </div>
    );
  }

  //  MAIN UI AFTER LOGIN
  return (
    <div className="app-container">
      <h1 className="app-title">Task Tracker 📝</h1>

      <button
        onClick={handleLogout}
        className="task-button"
        style={{ backgroundColor: '#d9534f', marginBottom: '1rem' }}
      >
        Logout
      </button>

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
        <button type="submit" className="task-button">
          Add
        </button>
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
                    onClick={() => handleToggleComplete(task.id, task.completed)}
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
