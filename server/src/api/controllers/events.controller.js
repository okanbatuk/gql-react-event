import Event from "../models/Event.js";

/*
 * Get all events
 * */
export const getEvents = async () => {
  const events = await Event.find().lean();
  return events;
};

/*
 *
 */
export const createEvent = async (event) => {
  const newEvent = new Event({
    ...event,
  });
  console.log(newEvent.date);

  const savedEvent = await newEvent.save();

  return savedEvent;
};
