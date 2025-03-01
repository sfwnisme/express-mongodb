require('dotenv').config();
const express = require('express')
const mongoose = require("mongoose")
const app = express()
const port = 5000;
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "courses"
}).then(() => {
  console.log('01- mongodb server started')
})

// async function DB() {
//   try {
//     console.log('🟨DB connecting...')
//     const db = await mongoose.connect(url2212, { dbName: 'courses' })
//     console.log('🟩DB connected')
//     return db
//   } catch (error) {
//     console.log('🟥DB_CONNECTION_ERROR', error)
//   }
// }
// DB()

const coursesRouter = require('./routes/courses.route')

app.use('/api/courses', coursesRouter)
app.listen(port, () => { console.log('listened') })