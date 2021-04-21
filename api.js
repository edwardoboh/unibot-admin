const express = require("express");
const route = express.Router();
const Department = require("./models/Department");
let response = "";
let deptData;
Department.find((err, resp) => {
  deptData = resp[0];
});

// async function fetchAllData(){
//   Department.find((err, resp) => {
//     console.log(resp[0])
//     deptData = resp[0]
//   })
// }

// All response functions

// GET INTENT FROM RESPONSE
function getIntent(resData) {
  const intent = resData.queryResult.intent.displayName;
  return intent;
}
// GET USER DETAILS USING RESPONSE
function getName(resData) {
  const userFirstName =
    resData.originalDetectIntentRequest.payload.data.from.first_name;
  const userLastName =
    resData.originalDetectIntentRequest.payload.data.from.last_name;
  return userLastName + " " + userFirstName;
}

// HANDLE INTENT GOTTEN FROM THE RESPONSE
function handleIntent(resData) {
  const intent = getIntent(resData);

  switch (intent) {
    case "get-student-details":
      // make request to database to get other user details
      let name = getName(resData);
      return name;
    case "get-news-update":
      // fetch last 3 updates from the database
      let news_1 = "School is resumming April 20th";
      let news_2 = "Second semester exam begins July 14th";
      return [news_1, news_2];
    case "hod-of-cpe":
      return deptData.hod;
    case "cpe-location":
      return deptData.location;
    case "cpe-history":
      return deptData.history;
    case "cpe-email":
      return `Email address is ${deptData.email}`;
    case "number-of-courses":
      return `Total number of offered courses is ${deptData.numOfCourses}`;
    case "number-of-students":
      return `Total number of Students is ${deptData.totalNumOfStud}`;
    case "number-of-lecturers":
      return `There are ${deptData.totalNumOfLec} lectures in CPE`;
    default:
      return "Not yet set";
  }
}

// FORMAT THE TEXT TO BE SENT TO THE USER
function formatResponse(theData) {
  let unibotRes;

  if (Array.isArray(theData)) {
    unibotRes = theData.map((aData) => {
      return {
        text: {
          text: [`${aData}`],
        },
      };
    });
  } else {
    unibotRes = [
      {
        text: {
          text: [`${theData}`],
        },
      },
    ];
  }

  return {
    fulfillmentMessages: unibotRes,
  };
}

// API ENDPOINTS FOR DIALOGFLOW

route.post("/api", (req, res) => {
  // fetchAllData()
  response = JSON.stringify(req.body);
  let toUser = handleIntent(req.body);
  let theResponse = formatResponse(toUser);
  res.json(theResponse);
});

// ADMIN DASHBOARD RENDER HTML PAGES

function formatForUpdate(fromForm) {
  const {
    hod,
    location,
    email,
    numOfCourses,
    totalNumOfStud,
    totalNumOfLec,
    totalStudInClass100,
    totalStudInClass200,
    totalStudInClass300,
    totalStudInClass400,
    totalStudInClass500,
    courseAdvisers100,
    courseAdvisers200,
    courseAdvisers300,
    courseAdvisers400,
    courseAdvisers500,
    deptHistory,
  } = fromForm;

  const toMongo = {
    history: deptHistory,
    hod: hod,
    location: location,
    email: email,
    numOfCourses: numOfCourses,
    courseList: {
      l500: [501, 513, 515, 557, 575, 593, 591, 571],
      l400: [401, 413, 415, 457, 475, 493, 491, 471],
      l300: [301, 313, 315, 357, 375, 393, 391, 371],
      l200: [201, 213, 215, 257, 275, 293, 291, 271],
      l100: [101, 113, 115, 157, 175, 193, 191, 171],
    },
    allLecturers: [
      {
        fullName: "Engr Obayuwana",
        courses: [314, 475, 457, 513],
      },
      {
        fullName: "Engr Odia",
        courses: [375, 515, 513],
      },
      {
        fullName: "Engr Isi",
        courses: [473, 461, 573],
      },
    ],
    totalNumOfLec: totalNumOfLec,
    totalNumOfStud: totalNumOfStud,
    totalStudInClass: {
      l100: totalStudInClass100,
      l200: totalStudInClass200,
      l300: totalStudInClass300,
      l400: totalStudInClass400,
      l500: totalStudInClass500,
    },
    courseAdvisers: {
      l100: courseAdvisers100,
      l200: courseAdvisers200,
      l300: courseAdvisers300,
      l400: courseAdvisers400,
      l500: courseAdvisers500,
    },
  };
  return toMongo;
}

route.get("/", (req, res) => {
  Department.find().then((resp) => {
    return res.render("pages/index", { resp, response, activePage: "home" });
  });
});

route.get("/department", (req, res) => {
  Department.find().then((resp) => {
    return res.render("pages/department", { resp, activePage: "department" });
  });
});

route.post("/department", (req, res) => {
  const updated = formatForUpdate(req.body);
  Department.findOneAndReplace({}, updated).then(() => {
    return res.send("Replace successful");
  });
});

route.get("/students", (req, res) => {
  Department.find().then((resp) => {
    return res.render("pages/students", {
      resp,
      response,
      activePage: "students",
    });
  });
});

route.get("/updates", (req, res) => {
  Department.find().then((resp) => {
    return res.render("pages/updates", {
      resp,
      response,
      activePage: "updates",
    });
  });
});

// ADMIN TEST ENDPOINT FOR CREATING AND GETTING ALL DATA

route.post("/admin", (req, res) => {
  const newData = new Department(req.body);
  newData.save().then((resp) => {
    res.json(resp);
  });
});

route.get("/admin", (req, res) => {
  Department.find().then((resp) => {
    return res.json(resp);
  });
});

module.exports = route;
