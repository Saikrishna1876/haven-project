import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "check-inactivity",
  { hours: 1 }, // Run every hour
  internal.rules.checkInactivity,
);

export default crons;
