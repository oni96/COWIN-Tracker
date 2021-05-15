import { caller } from "./Controller/VacineDates";
import fs from "fs";
import path from "path";
import cron from "cron";

import { getAvailableSlots } from "./Controller/GetAvailableSlot";

const main = (pins: any) => {
  pins.pins.map((pin: any) => {
    caller(pin);
  });
};

const getUserPins = () => {
  console.log("Wrtitng required pins");

  delete require.cache[require.resolve("./users/user.json")];
  const users = require("./users/user.json");

  let pins: any = new Set();

  users.forEach((user: any) => {
    user.pins.forEach((pin: any) => {
      pins.add(pin);
    });
  });

  console.log(Array.from(pins));

  const obj = {
    pins: Array.from(pins),
  };

  fs.writeFileSync(
    path.join(__dirname, "pincodes", "pins.json"),
    JSON.stringify(obj)
  );
};

const cronJob = new cron.CronJob("* * * * *", () => {
  delete require.cache[require.resolve("./pincodes/pins.json")];
  const pins = require("./pincodes/pins.json");
  main(pins);
});

const getUserPinsJob = new cron.CronJob("*/45 * * * * *", getUserPins);

getAvailableSlots("700019");
// getUserPinsJob.start();
// cronJob.start();
