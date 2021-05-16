import { caller } from "./Controller/VacineDates";
import cron from "cron";
import dotenv from "dotenv";

import { getAvailableSlots, sendWAMessage } from "./Controller/GetAvailableSlot";
import {
  connect,
  getAvailableSlotsFromDB,
  getUsersFromDB,
} from "./Controller/DBConnect";

dotenv.config();

const districts = require("./mappings/states-districts.json");

const main = () => {
  const my_state = districts.filter((d: any) => d.state == "West Bengal");

  my_state[0].districts.map((d: any) => {
    caller(d.district_id);
  });
};

const notifyUsers = () => {
  getUsersFromDB().then((users) => {
    const myDistricts = districts.filter(
      (d: any) => d.state == "West Bengal"
    )[0].districts;

    console.log(users);

    users.forEach((user: any) => {
      const userSubs = user.districts;

      const res = myDistricts.filter(
        (d: any) => d.district_name == userSubs
      );
      console.log(res[0]);

      getAvailableSlots(res[0].district_id, user.phone);
    });
  });
};

const mainJob = new cron.CronJob("2 8-23/1 * * *", () => {
  main();
});

const notifyJob = new cron.CronJob("15 8-23/1 * * *", () => {
  notifyUsers();
});

connect().then(() => {
  main();
  mainJob.start();
  notifyJob.start();
});



// sendWAMessage("TEST TEST","9232475165")