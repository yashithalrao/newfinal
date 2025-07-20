const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 5000;


const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // ✅ Import taskRoutes

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => console.error(err));
