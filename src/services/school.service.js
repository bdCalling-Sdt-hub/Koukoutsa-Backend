const School = require("../models/school.model");

const createSchool = async (schoolData, userId) => {

    const school = await School.create({ ...schoolData, schoolId: userId });
    return school;
};

const getSchoolAll = async () => {
    const schools = await School.find();
    return schools;
};
const getSchoolById = async (schoolId) => {
    const school = await School.findById(schoolId);
    return school;
};

const updateSchool = async (schoolId, updateData) => {
    const school = await School.findByIdAndUpdate(schoolId, updateData, { new: true });
    return school;
};
const deleteSchool = async (schoolId) => {
    await School.findByIdAndDelete(schoolId);
};

module.exports = {
    createSchool,
    getSchoolById,
    getSchoolAll,
    updateSchool,
    deleteSchool
};
