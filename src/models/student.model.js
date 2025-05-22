const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: null,
    },
    studentName: {
        type: String,
        required: true,
    },
    studentImage: {
        type: String,
        required: true,
    },
    contactPerson1Name: {
        type: String,
        required: true,
    },
    contactPerson1Number: {
        type: Number,
        required: true,
    },
    contactPerson2Name: {
        type: String,
    },
    contactPerson2Number: {
        type: Number,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);