import { eventsService } from "../services/index.js";

const queries = {
  events: () => eventsService.getEvents(),
};

const mutations = {
  addEvent: async (_, args) => {
    let event = await eventsService.createEvent(args.event);
    return event;
  },
  updateEvent: async (_, args) => {
    let updatedEvent = await eventsService.updateEvent(args._id, args.edits);
    return updatedEvent;
  },
  deleteEvent: async (_, args) => {
    let events = await eventsService.deleteEvent(args._id);
    return events;
  },
};

export { queries, mutations };
