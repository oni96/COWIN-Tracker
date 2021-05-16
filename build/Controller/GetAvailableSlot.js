"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = exports.db = void 0;
var nedb_1 = __importDefault(require("nedb"));
exports.db = new nedb_1.default({
    filename: "./db.json",
    // NEED TO WRITE ENCRYPTION MODELS HERE
    // afterSerialization: function (plaintext) {
    // },
    // beforeDeserialization: function(ciphertext){
    // }
});
var getAvailableSlots = function (pin, phone) {
    exports.db.loadDatabase();
    exports.db.persistence.compactDatafile();
    exports.db.find({ district_id: parseInt(pin) }, function (err, docs) {
        if (docs.length > 0) {
            var leads = docs[0].data.filter(function (l) { return l.available > 0; });
            // console.log(leads);
            if (leads.length > 0) {
                leads.forEach(function (element) {
                    console.log("Send notif to user: ", phone);
                    var body = createMessageBody(element);
                    var accountSid = process.env.TWILIO_ACCOUNT_SID;
                    var authToken = process.env.TWILIO_AUTH_TOKEN;
                    var client = require("twilio")(accountSid, authToken);
                    console.log(body);
                    client.messages
                        .create({
                        body: body,
                        from: "+16789168968",
                        to: "+91" + phone,
                    })
                        .then(function (message) { return console.log(message.sid); })
                        .catch(function (err) { return console.log(err); });
                });
            }
            else {
                console.log("No Notif Required", phone, "district:", pin);
            }
        }
    });
};
exports.getAvailableSlots = getAvailableSlots;
var createMessageBody = function (leads) {
    var body = leads.available + " slot(s) for " + leads.vaccine + "(" + leads.fee_type + ") found on " + leads.date + " at " + leads.name + "," + leads.address + ", " + leads.district_name + ". Open COWIN website/app to register now.";
    return body;
};
