import User from "../models/User.js";

// Get All Users
export const getAll = async () => {
  const users = await User.find().lean();
  return users;
};

// Get User by _id
export const getUserById = async (_id) => {
  const user = await User.findById(_id).lean();
  return user;
};

// Get user by email
export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  return user;
};

// Push the event id to user's prop when creating new event
export const findAndAddEvent = async (_id, event_id) => {
  // Push the new event_id to user.createdEvents arr
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $push: { createdEvents: event_id } }
  );

  return modifiedCount;
};

// Delete the event id from user.createdEvents array when deleting the event
export const findAndDeleteEvent = async (_id, event_id) => {
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $pull: { createdEvents: event_id } }
  );
  return modifiedCount;
};
