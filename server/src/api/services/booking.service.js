import _ from "lodash";
import Booking from "../models/Booking.js";

// Get all bookings
export const getAll = async () => {
  const bookings = await Booking.find().lean();

  return bookings;
};

// Booking an Event
export const bookEvent = (eventId, userId) => {
  return new Promise(async (resolve, reject) => {
    const newBooking = new Booking({
      event: eventId,
      user: userId,
    });

    const savedBooking = await newBooking.save();
    savedBooking
      ? resolve(savedBooking)
      : reject({
          message: "Booking didn't create!",
          code: "500_INTERNAL_SERVER_ERROR",
        });
  });
};
