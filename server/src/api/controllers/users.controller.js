import { GraphQLError } from "graphql";
import { usersService } from "../services/index.js";
import transformData from "../utils/transformData.js";
import checkField from "../helpers/checkField.js";

export const queries = {
  users: async () => {
    try {
      // Get All Users
      const users = await usersService.getAll();

      // Check if users variable is empty
      await checkField(users, "User");

      // Transform info of all users
      return users.map((user) => transformData(user));
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
  user: async (...[, args]) => {
    try {
      // Get the user by id
      const user = await usersService.getUserById(args._id);

      // Check if user is empty
      await checkField(user, "User");

      return transformData(user);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

export const relations = {
  // This relation is for response that returns Event
  creator: async (parent) => {
    try {
      const user = await usersService.getUserById(parent.creator);

      // Check if user is empty
      await checkField(user, "User");

      return transformData(user);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },

  // This relation is for response that returns Booking
  user: async (parent) => {
    try {
      const user = await usersService.getUserById(parent.user);

      // Check if user is empty
      await checkField(user, "User");

      return transformData(user);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};
