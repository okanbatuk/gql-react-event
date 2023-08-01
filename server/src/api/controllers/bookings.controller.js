import _ from "lodash";
import { GraphQLError } from "graphql";
import {
  bookingsService as bs,
  usersService as us,
  eventsService as es,
} from "../services/index.js";
import transformData from "../utils/transformData.js";
import checkField from "../helpers/checkField.js";

const queries = {
  bookings: async (...[, , contextValue]) => {
    try {
      const { email } = contextValue;

      // Get user by email
      const user = await us.getUserByEmail(email);

      // Check for user variable
      await checkField(user, "User");

      // Get all bookings
      const bookings = await bs.getBookingByUserId(user._id);

      // Check if bookings variable is empty
      await checkField(bookings, "Booking");

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
      const { email } = contextValue;

      // Get user
      const user = await us.getUserByEmail(email);

      // Check if user is empty
      await checkField(user, "User");

      // Get event
      const event = await es.getEventById(args.event);

      // Check if event is empty
      await checkField(event, "Event");

      // Create a new Book
      const newBooking = await bs.bookEvent(event._id, user._id);

      return transformData(newBooking._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
  cancelBooking: async (...[, args, contextValue]) => {
    try {
      const { email } = contextValue;

      // Get user by email
      const user = await us.getUserByEmail(email);

      // Get the booking
      // User can only cancel their own bookings
      const booking = await bs.getBookingsById(args._id, user._id);

      // Check if booking variable is empty
      await checkField(booking, "Booking");

      const canceledEvent = {
        ...booking.event,
      };

      // Check the canceled event obj
      if (_.isEmpty(canceledEvent))
        throw {
          message: "Event is missing..",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        };

      // Delete the booking
      await bs.deleteBooking(booking._id);
      return transformData(canceledEvent);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

export { queries, mutations };
