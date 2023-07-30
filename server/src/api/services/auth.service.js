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
        extensions: { code: "INTERNAL_SERVER_ERROR", http: 500 },
      });

    // Save and return the newUser
    await newUser.save();
    return newUser._doc;
  } else {
    // If there is a conflict user return GraphQLError
    throw new GraphQLError("Username or email already in use..", {
      extensions: { code: "CONFLICT", http: 409 },
    });
  }
};

export const login = async (userInfo) => {
  const { email, password } = userInfo;
  try {
    const user = await User.findOne(
      { email: email.toLowerCase() },
      { createdEvents: 0 }
    ).lean();

    let comparePwd = user && (await compare(password, user.password));

    if (!user || !comparePwd)
      throw new GraphQLError("Email or Password is incorrect.", {
        extensions: { code: "UNAUTHORIZED", http: 401 },
      });

    return user;
  } catch (err) {
    throw new GraphQLError(err.message, {
      extensions: { code: "INTERNAL_SERVER_ERROR", http: 500 },
    });
  }
};
