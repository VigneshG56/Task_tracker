const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const Task = require('./models/Task');
const taskRoutes = require('./routes/taskRoutes');

//load env variables from .env

dotenv.config(); 


// create express app
const app = express();

// middleware to parse JSON and allow frontend to connect
app.use(cors());
app.use(express.json());   

// Error handler for bad JSON input
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(' Invalid JSON received:', err.message);
    return res.status(400).json({ message: 'Invalid JSON input' });
  }
  next();
});


//register routes
app.use('/api', taskRoutes);

// db connection psql
connectDB(); 

// sync the task model with the db
Task.sync()
   .then(() => console.log('task table synced'));
 

   

//test route
app.get('/',(req, res) => {
    res.send('Backend is running');
});

// start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});

