import _ from "lodash";
import { GraphQLError } from "graphql";
import * as services from "../services/index.js";
import transformData from "../utils/transformData.js";
import checkContext from "../helpers/checkContext.js";

const queries = {
  bookings: async (...[, , contextValue]) => {
    try {
      // If there isn't an authenticated user return error
      const user = await checkContext(contextValue);

      // Get all bookings
      const bookings = await services.bookingsService.getAll();

      // If there is no booking return error
      if (!bookings.length)
        throw {
          message: "There is no Booking",
          code: "NOT_FOUND",
          status: 404,
        };

      // Convert to dates
      return bookings.map((booking) => {
        return transformData(booking);
      });
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

const mutations = {
  bookEvent: async (...[, args, contextValue]) => {
    try {
      // If there isn't an authenticated user return error
      // TODO This user'll book an event
      const loginUser = await checkContext(contextValue);

      // Get event
      const event = await services.eventsService.getEventById(args.event);
      if (_.isEmpty(event))
        throw { message: "Event not found!!", code: "NOT_FOUND", status: 404 };

      // Get user
      const user = await services.usersService.getUserById(args.user);
      if (_.isEmpty(user))
        throw { message: "User not found!!", code: "NOT_FOUND", status: 404 };

      // Create a new Book
      const newBooking = await services.bookingsService.bookEvent(
        args.event,
        args.user
      );

      return transformData(newBooking._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
  cancelBooking: async (...[, args, contextValue]) => {
    try {
      // If there isn't an authenticated user return error
      // TODO This user can only cancel their own booking
      const loginUser = await checkContext(contextValue);

      // Get the booking
      const booking = await services.bookingsService.getBookingById(args._id);
      if (_.isEmpty(booking))
        throw {
          message: "Booking not found!!",
          code: "NOT_FOUND",
          status: 404,
        };

      const canceledEvent = {
        ...booking.event,
      };
      if (_.isEmpty(canceledEvent))
        throw {
          message: "Event is missing..",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        };

      // Delete the booking
      await services.bookingsService.deleteBooking(booking._id);
      return transformData(canceledEvent);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

export { queries, mutations };
