import { usersService } from "../services/index.js";

export const queries = {
  users: () => usersService.getAll(),
  user: (_, args) => usersService.getUserById(args._id),
};

export const mutations = {};
