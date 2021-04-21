const express = require("express")
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')

require("dotenv").config()

// app.get("/", (req, res) => {
//     res.render("pages/index", {response : ""})
// })


app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(require('./api'))

// Connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Connection to Database was successful")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port, ", PORT))