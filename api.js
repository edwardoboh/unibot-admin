const express = require("express")
const route = express.Router()
let response = ""

route.get("/api", (req, res) => {
    res.send("This is the api route for the query chatbot")
})

route.post("/api", (req, res) => {
    response = JSON.stringify(req.body)
    const unibotRes = {
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                "Text response from nodeJS"
              ]
            }
          }
        ]
      }
    
    
    res.json(unibotRes)
})

route.get("/", (req, res) => {
    res.render("pages/index", {response})
})

module.exports = route