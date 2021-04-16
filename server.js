const express = require("express")
const app = express()
const ejs = require('ejs')

require("dotenv").config()

// app.get("/", (req, res) => {
//     res.render("pages/index", {response : ""})
// })


app.use(express.static("views"))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(require('./api'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port, ", PORT))