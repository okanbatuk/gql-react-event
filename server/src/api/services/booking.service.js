import _ from "lodash";
import Booking from "../models/Booking.js";

// Get all bookings
export const getAll = async () => {
  const bookings = await Booking.find().lean();

  return bookings;
};

// Get booking by id
export const getBookingById = async (bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId })
    .populate("event")
    .lean();
  return booking;
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
          message: "Booking not created!",
          code: "500_INTERNAL_SERVER_ERROR",
        });
  });
};

// Cancel the booking by id
export const deleteBooking = (bookingId) => {
  return new Promise(async (resolve, reject) => {
    const { deletedCount } = await Booking.deleteOne(bookingId);

    deletedCount
      ? resolve(true)
      : reject({
          message: "Booking not cancelled!",
          code: "500_INTERNAL_SERVER_ERROR",
        });
  });
};
