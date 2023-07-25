import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import User from "../models/User.js";

const { Types } = mongoose;

// Get All Users
export const getAll = async () => {
  const users = await User.find().lean();
  return users;
};

// Get User according to objectId
export const getUserById = async (_id) => {
  const user = await User.findById(_id).lean();

  if (!user)
    throw new GraphQLError("There is no user..", {
      extensions: { code: "404_NOT_FOUND" },
    });

  return user;
};

// Push the event id to user's prop when creating new event
export const findAndAddEvent = async (_id, event_id) => {
  // Push the new event_id to user.createdEvents arr
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $push: { createdEvents: event_id } }
  );

  if (modifiedCount <= 0)
    throw new GraphQLError(err.message, {
      extensions: { code: "500_INTERNAL_SERVER_ERROR" },
    });

  const user = await User.findById(_id).lean();

  return user;
};

// Delete the event id from user.createdEvents array when deleting the event
export const findAndDeleteEvent = async (_id, event_id) => {
  const { modifiedCount } = await User.updateOne(
    { _id },
    { $pull: { createdEvents: event_id } }
  );

  if (modifiedCount <= 0)
    throw new GraphQLError(err.message, {
      extensions: { code: "500_INTERNAL_SERVER_ERROR" },
    });

  const user = await User.findById(_id).lean();

  return user;
};
