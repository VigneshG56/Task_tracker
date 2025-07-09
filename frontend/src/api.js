import axios from 'axios';

// Create an axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// GET: Fetch all tasks
export const fetchTasks = () => API.get('/tasks');

//  POST: Create a new task
export const createTask = (newTask) => API.post('/tasks', newTask);

//  DELETE: Delete a task by ID
export const deleteTask = (id) => API.delete(`/tasks/${id}`); 

// PUT: Update task status (toggle completed)
export const updateTask = (id, updatedData) =>
  API.put(`/tasks/${id}`, updatedData);

