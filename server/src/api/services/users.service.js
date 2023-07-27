import User from "../models/User.js";

// Get All Users
export const getAll = async () => {
  return new Promise(async (resolve, reject) => {
    const users = await User.find().lean();
    users.length
      ? resolve(users)
      : reject({ message: "There is no user..", code: "404_NOT_FOUND" });
  });
};

// Get User according to objectId
export const getUserById = async (_id) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findById(_id).lean();
    user
      ? resolve(user)
      : reject({ message: "There is no user..", code: "404_NOT_FOUND" });
  });
};

// Push the event id to user's prop when creating new event
export const findAndAddEvent = async (_id, event_id) => {
  // Push the new event_id to user.createdEvents arr
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $push: { createdEvents: event_id } }
  );

  const user = modifiedCount && (await User.findById(_id).lean());

  return user;
};

// Delete the event id from user.createdEvents array when deleting the event
export const findAndDeleteEvent = async (_id, event_id) => {
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $pull: { createdEvents: event_id } }
  );

  const user = modifiedCount && (await User.findById(_id).lean());

  return user;
};
