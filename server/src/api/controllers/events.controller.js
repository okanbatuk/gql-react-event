import _ from "lodash";
import { GraphQLError } from "graphql";
import { eventsService, usersService } from "../services/index.js";
import transformData from "../utils/transformData.js";

const queries = {
  events: async () => {
    try {
      // Get All Events
      const events = await eventsService.getEvents();

      // If there is no events return error
      if (!events.length)
        throw {
          message: "There is no events..",
          code: "NOT_FOUND",
          status: 404,
        };

      // Convert the date props
      return events.map((event) => {
        return transformData(event);
      });
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },
  event: async (...[, args]) => {
    // Get event according to _id
    const event = await eventsService.getEventById(args._id);

    // If event doesn't exist return error
    if (_.isEmpty(event))
      throw new GraphQLError("There is no event..", {
        extensions: { code: "NOT_FOUND", http: 404 },
      });
    return transformData(event);
  },
};

const relations = {
  createdEvents: async (parent) => {
    const events = await eventsService.getUserEvents(parent._id);
    return events.map((event) => {
      return transformData(event);
    });
  },

  event: async (parent) => {
    try {
      const event = await eventsService.getEventById(parent.event);
      if (_.isEmpty(event))
        throw { message: "There is no user..", code: "NOT_FOUND", status: 404 };
      return transformData(event);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },
};

const mutations = {
  addEvent: async (_, args) => {
    try {
      const { event } = args;

      // Check user by creator id
      await usersService.getUserById(event.creator);

      // Create and return new Event
      const newEvent = await eventsService.createEvent(args.event);

      // Push the new Event id to user.createdEvents array
      const savedUser = await usersService.findAndAddEvent(
        event.creator,
        newEvent._id
      );

      // If update didn't successfully, delete the event and return error
      if (!savedUser) {
        await eventsService.deleteEvent(newEvent._id);
        throw {
          message: "Something went wrong..",
          code: "BAD_REQUEST",
          status: 400,
        };
      }

      return transformData(newEvent._doc);
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },

  // Update Event
  updateEvent: async (_, args) => {
    try {
      let updatedEvent = await eventsService.updateEvent(args._id, args.edits);
      return updatedEvent;
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },

  // Delete the Event
  deleteEvent: async (_, args) => {
    try {
      // Find the event
      const event = await eventsService.getEventById(args._id);

      if (!event)
        throw { message: "Event doesn't exist..", code: "404_NOT_FOUND" };

      // Delete the event id on user before deleting the event
      const user = await usersService.findAndDeleteEvent(
        event.creator,
        event._id
      );

      // If there is no updated user return GraphQL Error
      if (!user)
        throw {
          message: "This event is not associated with any user..",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        };

      // Delete the event and return the new Event List
      let newEventList = await eventsService.deleteEvent(event._id);
      return newEventList.map((event) => {
        return transformData(event);
      });
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code, http: err.status },
      });
    }
  },
};

export { queries, relations, mutations };
