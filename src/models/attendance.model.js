const mongoose = require('mongoose');


const attendanceSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    classDate: {
        type: Date,
        required: true
    },
    attendanceType: {
        type: String,
        enum: ['present', 'absent', 'onLeave'],
        default: "absent"
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);