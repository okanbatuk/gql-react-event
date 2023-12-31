import _ from "lodash";
import Booking from "../models/Booking.js";

// Get all bookings
export const getAll = async () => {
  const bookings = await Booking.find().lean();

  return bookings;
};

// Get booking by id
export const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId })
    .populate("event")
    .lean();
  return booking;
};

// Get booking by user id
export const getBookingsByUserId = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate("event")
    .lean();
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
          message: "Booking not created!",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
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
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
        });
  });
};

// Cancel bookings according to event
export const deleteBookingsByEventId = async (eventId) => {
  const { acknowledged } = await Booking.deleteMany({ event: eventId });
  return acknowledged;
};
