import { z } from 'zod';

export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z.string().min(2, 'Booker name must be at least 2 characters long'),
    bookerEmail: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    eventName: z.string().min(2, 'Event name must be at least 2 characters long'),
    eventDate: z.preprocess(
      (value) => {
        if (value instanceof Date) {
          return value.toISOString().split('T')[0];
        }
        if (typeof value === 'string') {
          return value;
        }
        return value;
      },
      z.string().refine((value) => {
        const date = new Date(value);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return !Number.isNaN(date.getTime()) && date > now;
      }, 'Event date must be in the future'),
    ),
    numberOfGuests: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value.trim() !== '') {
          return Number(value);
        }
        return value;
      },
      z
        .number({ invalid_type_error: 'Number of Guests must be a number' })
        .int('Number of Guests must be an integer')
        .min(1, 'Number of Guests must be greater than or equal to 1')
        .max(10, 'Number of Guests must be less than or equal to 10'),
    ),
    timeSlot: z
      .string()
      .min(1, 'Selected time slot is unavailable')
      .refine((value) => availableTimeSlots.includes(value), 'Selected time slot is unavailable'),
    eventLink: z.string().url('Invalid URL. Please enter a valid event link'),
  });
