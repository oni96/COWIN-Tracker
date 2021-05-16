"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var VacineDates_1 = require("./Controller/VacineDates");
var cron_1 = __importDefault(require("cron"));
var dotenv_1 = __importDefault(require("dotenv"));
var GetAvailableSlot_1 = require("./Controller/GetAvailableSlot");
dotenv_1.default.config();
var districts = require("./mappings/states-districts.json");
var main = function () {
    var my_state = districts.filter(function (d) { return d.state == "West Bengal"; });
    my_state[0].districts.map(function (d) {
        VacineDates_1.caller(d.district_id);
    });
};
var notifyUsers = function () {
    var users = require("./users/user.json");
    var myDistricts = districts.filter(function (d) { return d.state == "West Bengal"; })[0]
        .districts;
    // console.log(myDistricts);
    users.forEach(function (user) {
        var userSubs = __spreadArray([], user.districts);
        var res = myDistricts.filter(function (d) { return d.district_name == user.districts; });
        console.log(res[0]);
        GetAvailableSlot_1.getAvailableSlots(res[0].district_id, user.phone);
    });
};
var mainJob = new cron_1.default.CronJob("0 8-23/1 * * *", function () {
    main();
});
var notifyJob = new cron_1.default.CronJob("15 8-23/1 * * *", function () {
    notifyUsers();
});
mainJob.start();
notifyJob.start();
