const httpStatus = require("http-status");
const { User, Notification, Payment } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmailVerification } = require("./email.service");
const unlinkImages = require("../common/unlinkImage");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  console.log(oneTimeCode);
  // Create the user first
  const user = await User.create({ ...userBody, oneTimeCode });

  console.log(user);

  // Send verification email for specific roles
  if (user.role === "user" || user.role === "admin") {
    sendEmailVerification(user.email, oneTimeCode);
  }

  // Create a notification about the new user
  const data = await Notification.create({
    userId: user._id,
    content: "A new user has been created",
    type: "success",
  });


  return user;
};


const queryUsers = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" || key === "email" || key === "username") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const users = await User.paginate(query, options);

  // Convert height and age to feet/inches here...
  return users;
}; 



const getUserById = async (id) => {
  const user = await User.findById(id).populate("subscriptionId");

  return user
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody, files) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  if (files && files.length > 0) {
    updateBody.photo = files;
  } else {
    delete updateBody.photo; // remove the photo property from the updateBody if no new photo is provided
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const isUpdateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (updateBody.role === "user" || updateBody.role === "admin") {
    sendEmailVerification(updateBody.email, oneTimeCode);
  }

  Object.assign(user, updateBody, {
    isDeleted: false,
    isSuspended: false,
    isEmailVerified: false,
    isResetPassword: false,
    isPhoneNumberVerified: false,
    oneTimeCode: oneTimeCode,
  });
  await user.save();
  return user;
};


const getAllUsers = async () => {
  const totalUsers = await User.find({ role: "user", isDeleted: false }).sort({ createdAt: -1 });
  return {
    totalUsers: totalUsers.length,
    users: totalUsers
  };
};

const getUsersStatus = async () => {

  const totalUsers = await User.find({ role: "user", isDeleted: false });
  const totalSubscribers = await User.find({ role: "user", isSubscribed: true, isDeleted: false });
  // aggregate with amount
  const totalEarnings = await Payment.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" }
      }
    }
  ]);



  return {
    totalUsers: totalUsers.length,
    totalSubscribers: totalSubscribers.length,
    totalEarnings: totalEarnings[0].totalEarnings

  };
};

const getRecentUsers = async () => {
  const recentUsers = await User.find({ role: "user", isDeleted: false }).sort({ createdAt: -1 }).limit(5);
  return recentUsers;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isUpdateUser,
  getAllUsers,
  getUsersStatus,
  getRecentUsers
};