import { GraphQLError } from "graphql";
import { eventsService as es, usersService as us } from "../services/index.js";
import transformData from "../utils/transformData.js";
import checkField from "../helpers/checkField.js";

const queries = {
  events: async () => {
    try {
      // Get All Events
      const events = await es.getEvents();

      // Check if events variable is empty
      await checkField(events, "Event");

      // Convert the date props
      return events.map((event) => {
        return transformData(event);
      });
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
  event: async (...[, args]) => {
    try {
      // Get event according to _id
      const event = await es.getEventById(args._id);

      // Check if event variable is empty
      await checkField(event, "Event");

      return transformData(event);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

const relations = {
  createdEvents: async (parent) => {
    const events = await es.getUserEvents(parent._id);
    return events.map((event) => {
      return transformData(event);
    });
  },

  event: async (parent) => {
    try {
      const event = await es.getEventById(parent.event);
      // Check if event variable is empty
      await checkField(event, "Event");

      return transformData(event);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

const mutations = {
  addEvent: async (...[, args, contextValue]) => {
    try {
      const { email } = contextValue;

      // Get user according to login user
      const user = await us.getUserByEmail(email);

      // Create and return new Event
      const newEvent = await es.createEvent(args.event, user._id);

      // Push the new Event id to user.createdEvents array
      const modifiedCount = await us.findAndAddEvent(user._id, newEvent._id);

      // If update didn't successfully, delete the event and return error
      if (!modifiedCount) {
        await es.deleteEvent(newEvent._id);
        throw {
          message: "Something went wrong..",
          code: "BAD_REQUEST",
          status: 400,
        };
      }

      return transformData(newEvent._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },

  // Update Event
  updateEvent: async (...[, args, contextValue]) => {
    try {
      const { email } = contextValue;

      // Get user according to login user
      const user = await us.getUserByEmail(email);

      // Update the event.
      // User'll only be able to update their own events
      let updatedEvent = await es.updateEvent(args, user._id);
      const _ = await import("lodash");
      if (_.isEmpty(updatedEvent))
        throw {
          message: "Can not update the event.",
          code: "FORBIDDEN",
          status: 403,
        };

      return transformData(updatedEvent._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },

  // Delete the Event
  deleteEvent: async (...[, args, contextValue]) => {
    try {
      const { email } = contextValue;

      // Find the event
      const event = await es.getEventById(args._id);

      // Check if event variable is empty
      await checkField(event, "Event");

      // Get user according to login user
      const user = await us.getUserByEmail(email);

      // Delete all bookings of the event
      const { bookingsService: bs } = await import("../services/index.js");
      const acknowledged = await bs.deleteBookingsByEventId(event._id);
      if (!acknowledged)
        throw {
          message: "Something went wrong..",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        };

      // Delete the event id on user before deleting the event
      await us.findAndDeleteEvent(user._id, event._id);

      // Delete the event and return the new Event List
      const deletedCount = await es.deleteEvent(event._id, user._id);

      // If deletedCount is equal to 0 return error
      if (!deletedCount)
        throw {
          message: "You don't have Permission..",
          code: "FORBIDDEN",
          status: 403,
        };

      // Get user's events
      const newEventList = await es.getUserEvents(user._id);

      return newEventList.map((event) => {
        return transformData(event);
      });
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: { status: err.status } },
      });
    }
  },
};

export { queries, relations, mutations };
