import { hash, compare } from "bcrypt";
import User from "../models/User.js";

export const register = async (user) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = user;
    // Get the conflict user
    const conflictUser = await User.findOne({
      email: email.toLowerCase(),
    }).lean();

    let hashedPassword = !conflictUser && (await hash(password, 10));

    const newUser =
      hashedPassword &&
      new User({
        email: email.toLowerCase(),
        password: hashedPassword,
      });

    if (!conflictUser) {
      // If there is no conflicting user and not created user
      if (!newUser)
        reject({
          message: "Something went wrong..",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        });

      // Save and return the newUser
      await newUser.save();
      resolve(newUser);
    } else {
      // If there is a conflict user return GraphQLError
      reject({
        message: "Username or email already in use..",
        code: "CONFLICT",
        status: 409,
      });
    }
  });
};

export const login = async (userInfo) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userInfo;
    const user = await User.findOne(
      { email: email.toLowerCase() },
      { createdEvents: 0 }
    ).lean();

    let comparePwd = user && (await compare(password, user.password));

    if (!user || !comparePwd)
      reject({
        message: "Email or Password is incorrect.",
        code: "UNAUTHORIZED",
        status: 401,
      });

    resolve(user);
  });
};
