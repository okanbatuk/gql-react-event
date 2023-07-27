import { GraphQLError } from "graphql";
import { eventsService, usersService } from "../services/index.js";

const queries = {
  events: async () => {
    // Get All Events
    const events = await eventsService.getEvents();

    // If there is no events return error
    if (!events.length)
      throw new GraphQLError("There is no events..", {
        extensions: { code: "404_NOT_FOUND" },
      });
    return events;
  },
  event: async (_, args) => {
    // Get event according to _id
    const event = await eventsService.getEventById(args._id);

    // If event doesn't exist return error
    if (!event)
      throw new GraphQLError("There is no event..", {
        extensions: { code: "404_NOT_FOUND" },
      });
    return event;
  },
};

const relations = {
  User: {
    createdEvents: async (parent) => {
      try {
        const events = await eventsService.getUserEvents(parent._id);
        return events;
      } catch (err) {
        throw new GraphQLError(err.message, {
          extensions: { code: err.code },
        });
      }
    },
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
        throw new GraphQLError("Something went wrong..", {
          extensions: { code: "400_BAD_REQUEST" },
        });
      }

      return newEvent;
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: { code: err.code },
      });
    }
  },

  // Update Event
  updateEvent: async (_, args) => {
    try {
      let updatedEvent = await eventsService.updateEvent(args._id, args.edits);
      return updatedEvent;
    } catch (err) {
      throw new GraphQLError(err.message, { extensions: { code: err.code } });
    }
  },

  // Delete the Event
  deleteEvent: async (_, args) => {
    try {
      // Find the event
      const event = await eventsService.getEventById(args._id);

      if (!event)
        throw new GraphQLError("Event doesn't exist..", {
          extensions: { code: "404_NOT_FOUND" },
        });

      // Delete the event id on user before deleting the event
      const user = await usersService.findAndDeleteEvent(
        event.creator,
        event._id
      );

      // If there is no updated user return GraphQL Error
      if (!user)
        throw new GraphQLError("This event is not associated with any user..", {
          extensions: { code: "500_INTERNAL_SERVER_ERROR" },
        });

      // Delete the event and return the new Event List
      let newEventList = await eventsService.deleteEvent(event._id);
      return newEventList;
    } catch (err) {
      throw new GraphQLError(err.message, { extensions: { code: err.code } });
    }
  },
};

export { queries, relations, mutations };
