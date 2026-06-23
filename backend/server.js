// What the file needs to include :
// 1. Load environment variables 
// 2. Import express and create the app
// 3. Set up the middelware (cors, json parser)
// 4. Connect to mongodb
// 5. Mount routes 
// 6. start listening to a port 


 
// 1. load environment variable 
require('dotenv').config(); // read your .env file 

// 2. Import express and create the app server
const express = require('express');
const app = express();

// 3. Setup the middleware (cors , json parser)
const cors = require('cors');
app.use(cors());
app.use(express.json()); // json parser

// 4. connect to mongodb 
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB !');
    })
    .catch((error) => {
        console .error ('MonogDB connection error:', error);
    });


// 5. Mount routes

// auth routes - handles singup and login - jwt not needed
const authroutes = require('./routes/auth');
app.use('/api/auth', authroutes);

// folder routes - handles all folder operations - jwt required
const foldersroutes = require('./routes/folders');
app.use('/api/folders', foldersroutes);

// qa routes - handles all qa operations - jwt required
const qaRoutes = require('./routes/qa');
app.use('/api/qa', qaRoutes);

// ai routes - handles all ai operations - jwt required 
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);


// 6. Start listening to port 
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Hi !!!');
});
// binding the express app to the port 
app.listen(port, () => {
    console.log(`express server listening on port ${port}`);
});

 
