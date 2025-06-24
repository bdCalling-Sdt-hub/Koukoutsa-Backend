const cron = require("node-cron");
const { Student, Attendance } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const twilio = require('twilio');
const axios = require('axios');
const { infoBipApiKey, infoBipBaseUrl, viberSenderName } = require("../config/config");



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
    console.log(updatedResult);
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


// ===========================================================================================================================
// =========================================== Attendance Records Scheduling ================================================= 
// ===========================================================================================================================


cron.schedule("1 1 * * *", async () => {
    console.log(" ============================= Creating attendance records every day at 1:01 AM... ==============================");

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
const BASE_URL = infoBipBaseUrl; // Your Infobip base URL
const API_KEY = infoBipApiKey; // Your API key
const SENDER_ID = viberSenderName; // Your approved sender ID


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
const sendViber = async (to, text) => {
    try {
        const payload = {
            messages: [
                {
                    sender: SENDER_ID,
                    destinations: [{ to }],
                    content: {
                        text: text,
                        type: 'TEXT',
                    },
                    options: {
                        smsFailover: {
                            sender: SENDER_ID,
                            text: 'Some failover text',
                        },
                        label: 'TRANSACTIONAL',
                        applySessionRate: false,
                        toPrimaryDeviceOnly: false,
                    }
                }
            ]
        };

        const config = {
            headers: {
                Authorization: `App ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        const response = await axios.post(
            `${BASE_URL}/viber/2/messages`,
            payload,
            config
        );

        console.log("Viber response:", response.data); // Log the Viber API response

    } catch (error) {
        const errorData = error.response?.data || error.message;
        console.error('Full error details:', JSON.stringify(errorData, null, 2));
        if (error.response) {
            console.error('Response error status:', error.response.status);
            console.error('Response error data:', error.response.data);
        }
    }
};

// Helper function to convert time string (e.g. "12:00 PM") to Date object
const convertToDate = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');  // Extract time and AM/PM part
    let [hours, minutes] = time.split(':');  // Split into hours and minutes

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert time to 24-hour format for comparison
    if (modifier === 'PM' && hours !== 12) {
        hours += 12; // Convert PM times (except 12 PM) to 24-hour format
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0; // Convert 12 AM to 00 hours (midnight)
    }

    // Create Date object for 1st January 1970 with the converted hours and minutes
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);  // Set hours and minutes, with 0 seconds and milliseconds
    return date;
};

// cron.schedule('* * * * *', async () => {

//     const now = new Date();
//     const currentTime = convertToDate(`${now.getHours() % 12}:${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`);

//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);  // Set the time to midnight (start of today)

//     const students = await Attendance.find({
//         attendanceType: "absent",
//         classDate: { $gte: todayStart }  // Ensure classDate is today or later
//     }).populate("studentId").populate("classId");

//     // console.log(students);

//     if (!students || students.length === 0) {
//         console.warn('⚠️ No students found to send daily SMS and Viber messages.');
//         return;
//     }

//     // Prepare the message to send to each parent
//     for (const student of students) {
//         // Ensure that we have a valid contact number for the parent
//         if (!student.studentId.contactPerson1Number) {
//             console.warn(`⚠️ Skipping student ${student.studentId.studentName}: no parent contact number.`);
//             continue;
//         }

//         // Convert the setAlertTime to Date object for comparison
//         const classAlertTime = convertToDate(student.classId.setAlertTime);

//         // Compare if the class alert time is equal to the current time
//         // if (classAlertTime.getTime() === currentTime.getTime()) {
//         // Only send SMS if the times match

//         // Format the phone number (if necessary)
//         const to = formatPhoneNumber(student.studentId.countryCode + student.studentId.contactPerson1Number);
//         if (!to) {
//             console.warn(`⚠️ Skipping student ${student.studentId.studentName}: invalid phone number.`);
//             continue;
//         }

//         // Construct the message for the parent
//         const message = `Dear Parent,\n\nThis is a daily update regarding your child, ${student.studentId.studentName}, who is absent from school today.\n\nThank you.`;

//         // Send SMS message to the parent's phone
//         // await sendSMS(to, message); // Send SMS message to the parent

//         // Send Viber message to the parent
//         // await sendViber(to, message);

//         // console.log(`✅ SMS sent to ${to} for student ${student.studentId.studentName}`);
//         // }
//     }
// });

module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance,
    getAllStudentsAttendance,
    getStudentsByDate
};