export const checkContext = (context = {}) => {
  return new Promise((resolve, reject) => {
    context?.email
      ? resolve(context.email)
      : reject({
          message: "Token not provided",
          code: "BAD_REQUEST",
          status: 400,
        });
  });
};

const publicOps = ["login", "register"];

export const checkOps = (operation) => publicOps.includes(operation);
