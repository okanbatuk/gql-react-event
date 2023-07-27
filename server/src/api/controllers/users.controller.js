import { usersService } from "../services/index.js";

export const queries = {
  users: () => usersService.getAll(),
  user: (_, args) => usersService.getUserById(args._id),
};

export const relations = {
  Event: {
    creator: async (parent) => {
      try {
        const user = await usersService.getUserById(parent.creator);
        return user;
      } catch (err) {
        throw new GraphQLError(err.message, {
          extensions: { code: err.code },
        });
      }
    },
  },
};

export const mutations = {};
