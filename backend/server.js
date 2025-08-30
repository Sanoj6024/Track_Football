// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const footballApiRoutes = require('./routes/footballApiRoutes');




const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/football', footballApiRoutes);

// Mongo connection event logs
mongoose.connection.on('connected', () => console.log('MongoDB connected (event)'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error (event):', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected (event)'));

// Basic route
app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;
console.log('Attempting MongoDB connection...');
// Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})
.catch((err) => {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    console.error(err);
    process.exit(1);
});
// After other code
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// ... existing code above ...





// ... rest of existing code ...
