import Event from "../models/Event.js";

/*
 * Get all events
 * */
export const getEvents = async () => {
  const events = await Event.find().lean();
  return events;
};

/*
 * Get event according to _id
 *
 * */
export const getEventById = async (_id) => {
  const event = await Event.findOne({ _id }).lean();
  return event;
};

/*
 * Get user's events
 *
 * */
export const getUserEvents = async (userId) => {
  const events = await Event.find({ creator: userId }).lean();
  return events;
};

/*
 * Create a new Event
 */
export const createEvent = async (event) => {
  return new Promise(async (resolve, reject) => {
    // Create a new Event
    const newEvent = new Event({
      ...event,
    });

    // Save and return the new Event
    const savedEvent = await newEvent.save();
    savedEvent
      ? resolve(savedEvent)
      : reject({
          message: "Event didn't save",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        });
  });
};

/*
 * Update the Event
 *
 * */
export const updateEvent = async (_id, edits) => {
  return new Promise(async (resolve, reject) => {
    // Update the event according to _id
    const updatedEvent = await Event.findOneAndUpdate(
      { _id },
      {
        ...edits,
      },
      { returnDocument: "after" }
    );
    updateEvent
      ? resolve(updatedEvent)
      : reject({
          message: "Event didn't update.",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        });
  });
};

/*
 * Delete the Event
 *
 * */
export const deleteEvent = async (_id) => {
  return new Promise(async (resolve, reject) => {
    // Delete the event according to _id
    const { deletedCount } = await Event.deleteOne({ _id });

    // Get all events
    const events = await Event.find().lean();

    // If deletedCount is equal to 0 return null
    deletedCount
      ? resolve(events)
      : reject({
          message: "Event didn't delete",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        });
  });
};
