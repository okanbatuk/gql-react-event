import { usersService } from "../services/index.js";

export const queries = {
  users: () => usersService.getAll(),
  user: (_, args) => usersService.getUserById(args._id),
};

export const relations = {
  creator: async (parent) => {
    try {
      const user = await usersService.getUserById(parent.creator);
      return user;
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },

  user: async (parent) => {
    try {
      const user = await usersService.getUserById(parent.user);
      return user;
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },
};

export const mutations = {};
