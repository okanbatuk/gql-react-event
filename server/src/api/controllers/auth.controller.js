import { GraphQLError } from "graphql";
import { authService } from "../services/index.js";

const MAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

const validation = (user) => {
  return new Promise((resolve) => {
    resolve(MAIL_REGEX.test(user.email) && PWD_REGEX.test(user.password));
  });
};

export const mutations = {
  register: async (_, args) => {
    const { user } = args;
    const validate = await validation(user);

    if (!validate)
      throw new GraphQLError("ValidationError", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    let newUser = await authService.register(user);
    newUser.password = null;
    return newUser;
  },

  login: async (_, args) => {
    const { user } = args;
    const validate = await validation(user);
    if (!validate)
      throw new GraphQLError("ValidationError", {
        extensions: { code: "VALIDATION_ERROR" },
      });

    let loginUser = await authService.login(user);
    loginUser.password = null;
    return loginUser;
  },
};
