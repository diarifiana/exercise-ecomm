import { scheduleJob } from "node-schedule";

scheduleJob("job-running-every-10-seconds", "*/10 * * * * *", () => {
  console.log("JOB EXECUTED -> EVERY 10 SECOND");
});

scheduleJob("job-running-every-1-minute", "* * * * *", () => {
  console.log("JOB EXECUTED -> EVERY 1 MINUTE -> HELLO WORLD");
});
