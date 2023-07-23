import Event from "../models/Event.js";

/*
 * Get all events
 * */
export const getEvents = async () => {
  const events = await Event.find().lean();
  return events;
};

/*
 * Create a new Event
 */
export const createEvent = async (event) => {
  try {
    // Create a new Event
    const newEvent = new Event({
      ...event,
    });

    // Save the new Event
    const savedEvent = await newEvent.save();

    return savedEvent;
  } catch (err) {
    console.log(err);
    return [];
  }
};

/*
 * Update the Event
 *
 * */
export const updateEvent = async (_id, edits) => {
  try {
    // Update the event according to _id
    const updatedEvent = await Event.findOneAndUpdate(
      { _id },
      {
        ...edits,
      },
      { returnDocument: "after" }
    );
    return updatedEvent;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/*
 * Delete the Event
 *
 * */
export const deleteEvent = async (_id) => {
  try {
    // Delete the event according to _id
    const { deletedCount } = await Event.deleteOne({ _id });

    // Get all events
    const events = await Event.find().lean();

    // If deletedCount is equal to 0 return null
    return deletedCount > 0 ? events : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
