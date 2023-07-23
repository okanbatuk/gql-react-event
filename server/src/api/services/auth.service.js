import { hash, compare } from "bcrypt";
import { GraphQLError } from "graphql";
import User from "../models/User.js";

export const register = async (user) => {
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
      throw new GraphQLError("Something went wrong..", {
        extensions: { code: "500_OPERATION_FAILURE" },
      });

    // Save and return the newUser
    await newUser.save();
    return newUser;
  } else {
    // If there is a conflict user return GraphQLError
    throw new GraphQLError("Username or email already in use..", {
      extensions: { code: "409_CONFLICT" },
    });
  }
};

export const login = async (userInfo) => {
  const { email, password } = userInfo;
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).lean();

    let comparePwd = user && (await compare(password, user.password));

    if (!user || !comparePwd)
      throw new GraphQLError("Email or Password is incorrect.", {
        extensions: { code: "401_UNAUTHORIZED" },
      });

    return user;
  } catch (err) {
    throw new GraphQLError(err.message, {
      extensions: { code: "500_OPERATION_FAILURE" },
    });
  }
};
