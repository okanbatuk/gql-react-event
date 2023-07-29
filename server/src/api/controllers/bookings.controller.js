import _ from "lodash";
import { GraphQLError } from "graphql";
import * as services from "../services/index.js";
import transformData from "../utils/transformData.js";

const queries = {
  bookings: async () => {
    const bookings = await services.bookingsService.getAll();

    if (!bookings.length)
      throw new GraphQLError("There is no Booking", {
        extensions: { code: "404_NOT_FOUND" },
      });

    // Convert to dates
    return bookings.map((booking) => {
      return transformData(booking);
    });
  },
};

const mutations = {
  bookEvent: async (...[, args]) => {
    try {
      const event = await services.eventsService.getEventById(args.event);
      if (_.isEmpty(event))
        throw { message: "Event not found!!", code: "404_NOT_FOUND" };

      const user = await services.usersService.getUserById(args.user);
      if (_.isEmpty(user))
        throw { message: "User not found!!", code: "404_NOT_FOUND" };

      const newBooking = await services.bookingsService.bookEvent(
        args.event,
        args.user
      );

      return transformData(newBooking._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code },
      });
    }
  },
  cancelBooking: async (...[, args]) => {
    try {
      const booking = await services.bookingsService.getBookingById(args._id);
      if (_.isEmpty(booking))
        throw { message: "Booking not found!!", code: "404_NOT_FOUND" };

      const canceledEvent = {
        ...booking.event,
      };
      if (_.isEmpty(canceledEvent))
        throw {
          message: "Event is missing..",
          code: "500_INTERNAL_SERVER_ERROR",
        };

      await services.bookingsService.deleteBooking(booking._id);
      return transformData(canceledEvent);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code },
      });
    }
  },
};

export { queries, mutations };
