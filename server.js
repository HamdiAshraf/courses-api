const express = require('express');

const coursesRoute = require('./routes/courses.route')
const usersRoute = require('./routes/users.route')
const app = express();
app.use(express.json());

app.use('/api/courses', coursesRoute)
app.use('/api/users', usersRoute)


module.exports=app;