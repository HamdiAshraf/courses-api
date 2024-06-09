require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const coursesRoute = require('./routes/courses.route')
const usersRoute = require('./routes/users.route')
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')
// const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = require('./server')const PORT = process.env.PORT || 3000

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors())
app.use(express.json());

app.use('/api/courses', coursesRoute)
app.use('/api/users', usersRoute)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler
app.use((error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let statusText = error.statusText || httpStatusText.FAIL;
    let message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: statusText,
        message: message,
    });
});
//global middleware for handle not found routes
app.all('*', (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available', code: 404 })

})


//connect to db and run server
mongoose.connect(process.env.DB_URI).then(() => {
    console.log(`database server started`);
})
    .catch(err => {
        console.log(err);
    })

const server = app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);

})

module.exports = server
