import httpStatus from "http-status";
import APIError from "../helpers/errors/APIError.js";

const handler = (error, _, res) => {
  const response = {
    success: false,
    status: error.status || httpStatus[error.status],
    message: error.message,
  };
  let status = response.status || httpStatus.INTERNAL_SERVER_ERROR;
  res.status(status).json(response);
};

export default handler;
/*
 * error is difference from APIError
 *
 */
export const converter = (error, req, res, next) => {
  let convertedError = error;
  if (error.name == "ValidationError") {
    convertedError = new APIError({
      message: "ValidationError",
      status: error.statusCode || httpStatus.BAD_REQUEST,
    });
  } else if (!(error instanceof Error)) {
    convertedError = new APIError({
      message: error.message,
      status: error.status || httpStatus.BAD_REQUEST,
    });
  }
  return handler(convertedError, req, res);
};

export const notFound = (req, res, next) => {
  const error = new APIError({
    message: "NOT FOUND",
    status: httpStatus.NOT_FOUND,
  });
  return handler(error, req, res);
};
