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
    return newUser;
  },

  login: async (_, args) => {
    try {
      const { user } = args;

      // Validate the user body
      const validate = await validation(user);
      if (!validate)
        throw { message: "ValidationError", code: "400_VALIDATION_ERROR" };

      // Get the user who wants to login
      let loginUser = await authService.login(user);

      // Import generate token function
      const { default: generateToken } = await import(
        "../utils/generateToken.js"
      );

      // Generate new Token
      let accessToken = await generateToken({ user: loginUser.email });

      if (!accessToken)
        throw {
          message: "Something went wrong",
          code: "500_INTERNAL_SERVER_ERROR",
        };

      return {
        ...loginUser,
        createdAt: new Date(loginUser.createdAt).toISOString(),
        updatedAt: new Date(loginUser.updatedAt).toISOString(),
        accessToken,
      };
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code },
      });
    }
  },
};
