import { GraphQLError } from "graphql";
import { authService } from "../services/index.js";
import transformData from "../utils/transformData.js";

const MAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

const validation = (user) => {
  return new Promise((resolve) => {
    resolve(MAIL_REGEX.test(user.email) && PWD_REGEX.test(user.password));
  });
};

export const queries = {
  login: async (_, args) => {
    try {
      const { user } = args;

      // Validate the user body
      const validate = await validation(user);
      if (!validate)
        throw {
          message: "ValidationError",
          code: "VALIDATION_ERROR",
          status: 400,
        };

      // Get the user who wants to login
      let loginUser = await authService.login(user);

      // Import generate token function
      const { default: generateToken } = await import(
        "../utils/generateToken.js"
      );

      // Generate new Token
      let accessToken = await generateToken({ email: loginUser.email });
      if (!accessToken)
        throw {
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        };

      return {
        ...transformData(loginUser),
        accessToken,
      };
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

export const mutations = {
  register: async (_, args) => {
    try {
      const { user } = args;

      // Validate the email and password field
      const validate = await validation(user);

      // If validate is false return validation error
      if (!validate)
        throw {
          message: "ValidationError",
          code: "VALIDATION_ERROR",
          status: 400,
        };

      // Create a new User
      let newUser = await authService.register(user);
      return transformData(newUser._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};
