"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = void 0;
var DBConnect_1 = require("./DBConnect");
var getAvailableSlots = function (pin, phone) {
    DBConnect_1.getAvailableSlotsFromDB(pin).then(function (res) {
        if (res.length < 1) {
            console.log("No message for ", pin);
        }
        res.forEach(function (leads) {
            var body = createMessageBody(leads);
            console.log(body);
            sendTextMessage(body, phone);
        });
    });
};
exports.getAvailableSlots = getAvailableSlots;
var createMessageBody = function (leads) {
    var body = leads.available + " slot(s) for " + leads.vaccine + "(" + leads.fee_type + ") found on " + leads.date + " at " + leads.name + "," + leads.address + ", " + leads.district_name + ". Open COWIN website/app to register now.";
    return body;
};
var sendTextMessage = function (body, phone) {
    var accountSid = process.env.TWILIO_ACCOUNT_SID;
    var authToken = process.env.TWILIO_AUTH_TOKEN;
    var client = require("twilio")(accountSid, authToken);
    client.messages
        .create({
        body: body,
        from: "+16789168968",
        to: "+91" + phone,
    })
        .then(function (message) { return console.log(message.sid); })
        .catch(function (err) { return console.log(err); });
};
