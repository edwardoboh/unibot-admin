const express = require("express")
const route = express.Router()
let response = ""

// All response functions

// GET INTENT FROM RESPONSE
function getIntent(resData){
  const intent = resData.intent.displayName
  return intent
}
// GET USER DETAILS USING RESPONSE
function getName(resData){
  // make request to database to get other user details
  const userFirstName = resData
                      .originalDetectIntentRequest
                      .payload
                      .from
                      .first_name
  const userLastName = resData
                      .originalDetectIntentRequest
                      .payload
                      .from
                      .last_name
  return userLastName + " " + userFirstName
}

// HANDLE INTENT GOTTEN FROM THE RESPONSE
function handleIntent(resData){
  const intent = getIntent(resData)

  switch(intent){
    case "get-student-details":
      let name = getName(resData)
      return name
    default:
      return "Not yet set"
  }
}

// FORMAT THE TEXT TO BE SENT TO THE USER
function formatResponse(theData){
  const unibotRes = {
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            `${toUser}`
          ]
        }
      }
    ]
  }
  return unibotRes
}

// API ENDPOINTS FOR THIS SERVER

route.get("/api", (req, res) => {
    res.send("This is the api route for the query chatbot")
})

route.post("/api", (req, res) => {
    response = JSON.stringify(req.body)
    
    let toUser = handleIntent(req.body)
    let theResponse = formatResponse(toUser)
    res.json(theResponse)
})

route.get("/", (req, res) => {
    res.render("pages/index", {response})
})

module.exports = route