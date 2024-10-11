// Import all necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }))

// Mongo DB connection url
const DB_URL = 'mongodb+srv://admin:Password12345@cluster0.gkr9m.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority'

mongoose.Promise = global.Promise;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
});


// User Route connection
const userRoutes = require('./routes/userRoute');
app.use('/api/v1/user', userRoutes);

// Employee Route Connection
const employeeRoutes = require('./routes/employeeRoute');
app.use('/api/v1/emp', employeeRoutes);

const SERVER_PORT = 8084;
app.listen(SERVER_PORT, () =>{
    console.log(`Server running on port ${SERVER_PORT}`)
})

