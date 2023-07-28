import _ from "lodash";
import { GraphQLError } from "graphql";
import * as services from "../services/index.js";

const queries = {
  bookings: async () => {
    const bookings = await services.bookingsService.getAll();

    if (!bookings.length)
      throw new GraphQLError("There is no Booking", {
        extensions: { code: "404_NOT_FOUND" },
      });

    // Convert to dates
    return bookings.map((booking) => {
      return {
        ...booking,
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString(),
      };
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

      return {
        ...newBooking.doc,
        _id: newBooking.doc.id,
        createdAt: new Date(newBooking.doc.createdAt).toISOString(),
        updatedAt: new Date(newBooking.doc.updatedAt).toISOString(),
      };
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code },
      });
    }
  },
};

export { queries, mutations };
