const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DepartmentSchema = new Schema({
    history: String,
    hod: String,
    location: String,
    email: String,
    numOfCourses: Number,
    courseList: {
        l500: [],
        l400: [],
        l300: [],
        l200: [],
        l100: []
    },
    allLecturers : [{
        fullName : String,
        courses: []
    }],
    totalNumOfLec: Number,
    totalNumOfStud: Number,
    totalStudInClass: {
        l100: Number,
        l200: Number,
        l300: Number,
        l400: Number,
        l500: Number
    },
    courseAdvisers: {
        l100: String,
        l200: String,
        l300: String,
        l400: String,
        l500: String
    }
})

module.exports = mongoose.model("department", DepartmentSchema)