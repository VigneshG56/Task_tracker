const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// Sync DB and start server
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true }) // Use force: true only during dev reset (DROPS DATA!)
  .then(() => {
    console.log('All tables synced');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err.message);
  });
