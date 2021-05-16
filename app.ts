import { caller } from "./Controller/VacineDates";
import fs from "fs";
import path from "path";
import cron from "cron";
import dotenv from "dotenv";

import { getAvailableSlots } from "./Controller/GetAvailableSlot";

dotenv.config();

const districts = require("./mappings/states-districts.json");

const main = () => {
  const my_state = districts.filter((d: any) => d.state == "West Bengal");

  my_state[0].districts.map((d: any) => {
    caller(d.district_id);
  });
};

const notifyUsers = () => {
  const users = require("./users/user.json");
  const myDistricts = districts.filter((d: any) => d.state == "West Bengal")[0]
    .districts;

  // console.log(myDistricts);

  users.forEach((user: any) => {
    const userSubs = [...user.districts];

    const res = myDistricts.filter(
      (d: any) => d.district_name == user.districts
    );
    console.log(res[0]);

    getAvailableSlots(res[0].district_id, user.phone);
  });
};

const mainJob = new cron.CronJob("0 8-23/1 * * *", () => {
  main();
});

const notifyJob = new cron.CronJob("15 8-23/1 * * *", () => {
  notifyUsers();
});

mainJob.start();
notifyJob.start();
