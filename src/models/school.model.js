const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    className: {
        type: String,
        required: true,
        trim: true,
    },
    teacher: {
        type: String,
        required: true,
        trim: true,
    },
    setAlertTime: {
        type: Date,
    },
    totalStudents: {
        type: Number,
        default: 0,
    },
    studentsIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',  // assuming you have a Student model
    }],
}, {
    timestamps: true,
});


classSchema.pre('save', function (next) {
    this.totalStudents = this.studentsIds.length;
    next();
});
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
