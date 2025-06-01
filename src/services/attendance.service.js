const cron = require("node-cron");
const { Student, Attendance } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const twilio = require('twilio');
const axios = require('axios');




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



    if (!students || students.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No students found for this class");
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





// create Attendance records every this day at 8:00 PM
cron.schedule("0 20 * * *", async () => {
    try {
        const students = await Student.find({ classId: { $exists: true, $ne: null } });

        if (!students || students.length === 0) {
            console.log("No students found to create attendance records.");
            return;
        }

        const attendanceRecords = students.map(student => ({
            schoolId: student.schoolId,
            classId: student.classId,
            studentId: student._id,
            classDate: new Date(),
            attendanceType: "absent",
        }));

        await Attendance.insertMany(attendanceRecords);

        console.log(
            `Attendance records created successfully for all students. ${attendanceRecords.length} records created.`
        );
    } catch (error) {
        console.error("Error creating attendance records:", error);
    }
});




// Infobip credentials and setup
const BASE_URL = 'https://d9gldg.api.infobip.com'; // Replace if different for your account
const API_KEY = '8f05bef182a2013a6ebec32c40a3d454-9fac405e-5815-483f-80da-17d68f9ca6d7'; // Your API key
const SENDER_ID = 'InfoSMS'; // Change if needed

// Sample students array — replace with your real data
const students = [
    { name: 'John Brown', parentPhone: '+8801708784404' },
    { name: 'Jane Smith', parentPhone: '+8801740189038' },
    { name: 'Michael Lee', parentPhone: '+8801852219894' },
];

// Utility: Ensure phone number is in E.164 format (starts with '+')
const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    return phone.startsWith('+') ? phone : `+${phone}`;
};

// Send SMS function
const sendSMS = async (to, messageText) => {
    try {
        console.log(`📩 Sending SMS to ${to}...`);
        const response = await axios.post(
            `${BASE_URL}/sms/2/text/advanced`,
            {
                messages: [
                    {
                        from: SENDER_ID,
                        destinations: [{ to }],
                        text: messageText,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `App ${API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        console.log(`✅ SMS sent to ${to}:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error(
            `❌ SMS failed for ${to}:`,
            JSON.stringify(error.response?.data, null, 2) || error.message
        );
    }
};

// Send Viber function
const sendViber = async (to, messageText) => {
    try {
        console.log(`📩 Sending Viber to ${to}...`);
        const response = await axios.post(
            `${BASE_URL}/omni/1/advanced`,
            {
                messages: [
                    {
                        from: SENDER_ID,
                        destinations: [{ to }],
                        channel: 'VIBER',
                        viber: {
                            text: messageText,
                            validityPeriod: 720,
                            isPromotional: false,
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `App ${API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        console.log(`✅ Viber sent to ${to}:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error(
            `❌ Viber failed for ${to}:`,
            JSON.stringify(error.response?.data, null, 2) || error.message
        );
    }
};

// Cron job: runs daily at 9:00 AM server time
cron.schedule('0 20 * * *', async () => {
    console.log('⏰ Running daily student parent message job at 9:00 AM...');

    for (const student of students) {
        if (!student.parentPhone) {
            console.warn(`⚠️ Skipping student ${student.name}: no phone number.`);
            continue;
        }

        const to = formatPhoneNumber(student.parentPhone);
        if (!to) {
            console.warn(`⚠️ Skipping student ${student.name}: invalid phone number.`);
            continue;
        }

        const message = `Dear Parent,\nThis is a daily update regarding your child ${student.name}.\n\nThank you.`;

        await sendSMS(to, message);
        await sendViber(to, message);
    }

    console.log('✅ Daily messages sent to all student parents. 1');
});

// Optional: Run once immediately on startup to verify setup works
(async () => {
    console.log('🚀 Starting message sending script...');
    for (const student of students) {
        if (!student.parentPhone) continue;
        const to = formatPhoneNumber(student.parentPhone);
        const message = `Test message: Dear Parent, this is a test update for your child ${student.name}.`;
        await sendSMS(to, message);
        await sendViber(to, message);
    }
    console.log('🚀 Test messages sent. Waiting for scheduled cron job...');
})();

// const accountSid = 'ACfdaef053686531eabbd5ef72967f4ca6';
// const authToken = '7b7f244e185cf7a7bf96048167cd7cd1';

// const client = twilio(accountSid, authToken);

// cron.schedule("* * * * *", async () => {
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



//====================  every day at 9:01 AM is going to message every student prent phone viber if thay are absent ====================

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





module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance,
    getAllStudentsAttendance,
    getStudentsByDate
};
