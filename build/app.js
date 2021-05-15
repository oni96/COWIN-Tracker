"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var VacineDates_1 = require("./Controller/VacineDates");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cron_1 = __importDefault(require("cron"));
var main = function (pins) {
    pins.pins.map(function (pin) {
        VacineDates_1.caller(pin);
    });
};
var getUserPins = function () {
    console.log("Wrtitng required pins");
    delete require.cache[require.resolve("./users/user.json")];
    var users = require("./users/user.json");
    var pins = new Set();
    users.forEach(function (user) {
        user.pins.forEach(function (pin) {
            pins.add(pin);
        });
    });
    console.log(Array.from(pins));
    var obj = {
        pins: Array.from(pins),
    };
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "pincodes", "pins.json"), JSON.stringify(obj));
};
var cronJob = new cron_1.default.CronJob("* * * * *", function () {
    delete require.cache[require.resolve('./pincodes/pins.json')];
    var pins = require("./pincodes/pins.json");
    main(pins);
});
var getUserPinsJob = new cron_1.default.CronJob("*/5 * * * * *", getUserPins);
getUserPinsJob.start();
cronJob.start();
