const cron = require("node-cron");
const { Student, Attendance } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const twilio = require('twilio');


const createPresentAttendance = async (data) => {
    const { studentId } = data;
    if (!studentId || !Array.isArray(studentId) || studentId.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid attendanceIds");
    }

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const updatedResult = await Attendance.updateMany(
        {
            studentId: { $in: studentId },
            classDate: { $gte: startOfDay, $lt: endOfDay },
        },
        {
            $set: { attendanceType: "present" },
        }
    );
    if (updatedResult.modifiedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No attendance records found");
    }

    return updatedResult;
};


const createOnLeaveAttendance = async (data) => {
    const { studentId } = data;
    if (!studentId || !Array.isArray(studentId) || studentId.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid attendanceIds");
    }

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const updatedResult = await Attendance.updateMany(
        {
            studentId: { $in: studentId },
            classDate: { $gte: startOfDay, $lt: endOfDay },
        },
        {
            $set: { attendanceType: "onLeave" },
        }
    );
    if (updatedResult.modifiedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No attendance records found");
    }

    return updatedResult;
};

const getAllStudentsAttendance = async ({ userId, classId }) => {
    // Find students for this school and class first
    const students = await Attendance.find({ schoolId: userId, classId });

    console.log("students", students);

    if (!students || students.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No students found for this school");
    }

    // Get start of today in UTC
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));

    // Get start of next day in UTC
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

    // Query attendance records where classDate is between startOfDay (inclusive) and endOfDay (exclusive)
    const todayAttendanceRecords = await Attendance.find({
        schoolId: userId,
        classId,
        classDate: { $gte: startOfDay, $lt: endOfDay },
    }).populate("studentId");

    return {
        results: todayAttendanceRecords,
        totalStudents: todayAttendanceRecords.length,
    };
};

const getStudentsByDate = async ({ userId, classId, date }) => {
    // Get start of today in UTC
    const now = new Date(date);
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));

    // Get start of next day in UTC
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

    // Query attendance records where classDate is between startOfDay (inclusive) and endOfDay (exclusive)
    const todayAttendanceRecords = await Attendance.find({
        schoolId: userId,
        classId,
        classDate: { $gte: startOfDay, $lt: endOfDay },
    }).populate("studentId");

    return {
        results: todayAttendanceRecords,
        totalStudents: todayAttendanceRecords.length,
    };
};

// create Attendance records every day at 08:00AM

cron.schedule("0 8 * * *", async () => {
    try {
        const students = await Student.find();

        const attendanceRecords = students.map(student => ({
            schoolId: student.schoolId,
            classId: student.classId,
            studentId: student._id,
            classDate: new Date(),          // current date/time for the attendance record
            attendanceType: "absent"       // default attendance type; you can change this logic if needed
        }));

        // Insert many attendance records at once
        await Attendance.insertMany(attendanceRecords);

        console.log(`Attendance records created for ${students.length} students at ${new Date().toISOString()}`);
    } catch (error) {
        console.error("Error creating attendance records:", error);
    }
});


// every day at 9:01 AM is going to message every student prent phone viber if thay are absent

// const axios = require('axios');
// const VIBER_AUTH_TOKEN = '4c69729d7a1c90fe-60e6c4c7cfbc1f4a-b39ab953bf1804b4'; // Replace with your bot token

// cron.schedule("0 0 * * *", async () => {
//     console.log("Checking for absent students...");
//     try {
//         const startOfDay = new Date();
//         startOfDay.setUTCHours(0, 0, 0, 0);

//         const endOfDay = new Date(startOfDay);
//         endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

//         const absentStudents = await Attendance.find({
//             classDate: { $gte: startOfDay, $lt: endOfDay },
//             attendanceType: "absent"
//         }).populate("studentId");

//         for (const student of absentStudents) {
//             // const phoneNumber = student.studentId.contactPerson1Number;
//             const phoneNumber = +8801708784404; // Replace with the actual phone number field from your student model;
//             const name = student.studentId.studentName || "Student";

//             console.log(`Sending message to ${phoneNumber} about absence on ${student.classDate}`);

//             // Construct message
//             const message = {
//                 receiver: phoneNumber, // this must be Viber User ID, NOT phone number
//                 min_api_version: 1,
//                 sender: {
//                     name: "School Bot"
//                 },
//                 type: "text",
//                 text: `Hello ${name}, we noticed you were absent on ${student.classDate.toDateString()}. Please contact your teacher if this is incorrect.`
//             };

//             try {
//                 const res = await axios.post(
//                     'https://chatapi.viber.com/pa/send_message',
//                     message,
//                     {
//                         headers: {
//                             'X-Viber-Auth-Token': VIBER_AUTH_TOKEN,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );
//                 console.log(`Message sent to ${name}: ${res.data.status_message}`);
//             } catch (sendErr) {
//                 console.error(`Failed to send Viber message to ${phoneNumber}:`, sendErr.response?.data || sendErr.message);
//             }
//         }
//     } catch (error) {
//         console.error("Error checking for absent students:", error);
//     }
// });

//now every day at 9:01 AM is going to message every student prent phone number if thay are absent




// Replace with your credentials






















//================== every day SMS to student parent by phone number =============================

// const accountSid = 'ACfdaef053686531eabbd5ef72967f4ca6';
// const authToken = '43246281943ebc58239fc088c1db19e1    || testing';

// const client = twilio(accountSid, authToken);

// cron.schedule("50 9 * * *", async () => {
//     try {
//         const message = await client.messages.create({
//             body: 'Hello from Node.js!',
//             from: '+15856678949', // Your Twilio phone number in E.164 format
//             to: '+8801708784404'   // Recipient's phone number in E.164 format
//         });
//         console.log('Message sent, SID:', message.sid);
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// });






module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance,
    getAllStudentsAttendance,
    getStudentsByDate
};
