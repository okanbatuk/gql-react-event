import _ from "lodash";
export default (context = {}) => {
  return new Promise((resolve, reject) => {
    !_.isEmpty(context.user)
      ? resolve(context.user)
      : reject({
          message: "Token not provided",
          code: "BAD_REQUEST",
          status: 400,
        });
  });
};
