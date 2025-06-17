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
const BASE_URL = infoBipBaseUrl; // Your Infobip base URL
const API_KEY = infoBipApiKey; // Your API key
const SENDER_ID = viberSenderName; // Your approved sender ID

// Sample students array — replace with your real data
const students = [
    //   { name: 'Michael Lee', parentPhone: '+8801852219894' },
    // { name: 'Emily Smith', parentPhone: '+8801708784404' },
    { name: 'Emily Smith', parentPhone: '+8801740189038' },
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
const sendViber = async (to, text) => {
    try {


        const payload = {
            messages: [
                {
                    sender: SENDER_ID,  // Your sender's number
                    destinations: [
                        {
                            to: "+8801852219894",
                        },
                    ],
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

        await axios.post(
            `${BASE_URL}/viber/2/messages`,
            payload,
            config
        );



    } catch (error) {
        const errorData = error.response?.data || error.message;
        console.error('Full error details:', JSON.stringify(errorData, null, 2));

    }
};

// Cron job: runs after every 5 socend 
cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Running daily student parent SMS and Viber job at 8:00 AM...');

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

        const message = `Dear Parent,
        \n\nThis is a daily update regarding your child are not coming to school today ${student.name}.
        \n\nThank you.`;

        // await sendSMS(to, message);
        await sendViber(to, message);
    }

    console.log('✅ Daily SMS and Viber messages sent to all student parents.');
});




module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance,
    getAllStudentsAttendance,
    getStudentsByDate
};
