import _ from "lodash";
import { GraphQLError } from "graphql";
import { usersService } from "../services/index.js";
import transformData from "../utils/transformData.js";
import checkContext from "../helpers/checkContext.js";

export const queries = {
  users: async (...[, , contextValue]) => {
    try {
      // If there isn't an authenticated user return error
      await checkContext(contextValue);

      // Get All Users
      const users = await usersService.getAll();

      // Transform info of all users
      return users.map((user) => transformData(user));
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
  user: async (...[, args, contextValue]) => {
    try {
      // If there isn't an authenticated user return error
      await checkContext(contextValue);

      // Get the user by id
      const user = await usersService.getUserById(args._id);
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
      return transformData(user);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};
