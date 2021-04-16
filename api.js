const express = require("express")
const route = express.Router()
let response = ""

// All response functions

// GET INTENT FROM RESPONSE
function getIntent(resData){
  const intent = resData.queryResult.intent.displayName
  return intent
}
// GET USER DETAILS USING RESPONSE
function getName(resData){
  const userFirstName = resData
                      .originalDetectIntentRequest
                      .payload
                      .data
                      .from
                      .first_name
  const userLastName = resData
                      .originalDetectIntentRequest
                      .payload
                      .data
                      .from
                      .last_name
  return userLastName + " " + userFirstName
}

// HANDLE INTENT GOTTEN FROM THE RESPONSE
function handleIntent(resData){
  const intent = getIntent(resData)

  switch(intent){
    case "get-student-details":
      // make request to database to get other user details
      let name = getName(resData)
      return name
    case "get-news-update":
      // fetch last 3 updates from the database
      let news_1 = "School is resumming April 20th"
      let news_2 = "Second semester exam begins July 14th"
      return [news_1, news_2]
    default:
      return "Not yet set"
  }
}

// FORMAT THE TEXT TO BE SENT TO THE USER
function formatResponse(theData){
  let unibotRes

  if(Array.isArray(theData)){
    unibotRes = theData.map(aData => {
      return {
            "text": {
              "text": [
                `${aData}`,
                "News update #"
              ]
            }
          }
    })
  }else{
    unibotRes = 
        {
          "text": {
            "text": [
              `${theData}`
            ]
          }
        }
  }
  
  return {
    "fulfillmentMessages": unibotRes
  }
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