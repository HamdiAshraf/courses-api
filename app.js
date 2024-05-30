require('dotenv').config()
const express = require('express');
const mongoose=require('mongoose')
const coursesRoute = require('./routes/courses.route')
const app = express();
const PORT = 3000


app.use(express.json());

app.use('/api/courses', coursesRoute)


//connect to db and run server
mongoose.connect(process.env.DB_URI).then(()=>{
    console.log(`database server started`);

    app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
    })
})
.catch(err=>{
    console.log(err);
})