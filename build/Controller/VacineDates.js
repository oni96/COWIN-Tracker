"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caller = exports.db = void 0;
var axios_1 = __importDefault(require("axios"));
var requestHeaders_json_1 = __importDefault(require("../headerconfigs/requestHeaders.json"));
var dateformat_1 = __importDefault(require("dateformat"));
var nedb_1 = __importDefault(require("nedb"));
exports.db = new nedb_1.default({
    filename: "./db.json",
    // NEED TO WRITE ENCRYPTION MODELS HERE
    // afterSerialization: function (plaintext) {
    // },
    // beforeDeserialization: function(ciphertext){
    // }
});
var getVacccineDates = function (pin, date) {
    exports.db.loadDatabase();
    exports.db.persistence.compactDatafile();
    var formatDate = dateformat_1.default(date, "dd-mm-yyyy");
    var requestQuery = "pincode=" + pin + "&date=" + formatDate;
    console.log(requestQuery);
    axios_1.default
        .get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?" + requestQuery, {
        headers: requestHeaders_json_1.default,
    })
        .then(function (response) {
        //looping thru the data
        var finData = [];
        if (response.data.centers.length > 0) {
            response.data.centers.forEach(function (element) {
                var finRow = {};
                finRow.name = element.name;
                finRow.address = element.address;
                finRow.state_name = element.state_name;
                finRow.district_name = element.district_name;
                finRow.pincode = element.pincode;
                finRow.fee_type = element.fee_type;
                var sessions = element.sessions;
                sessions.forEach(function (ses) {
                    var finRow2 = {};
                    finRow2.date = ses.date;
                    finRow2.available = ses.available_capacity;
                    finRow2.min_age = ses.min_age_limit;
                    finRow2.vaccine = ses.vaccine;
                    finRow2.fees =
                        element.fee_type == "Paid"
                            ? element.vaccine_fees.filter(function (v) { return v.vaccine == finRow2.vaccine; })[0].fee
                            : 0;
                    finData.push(__assign(__assign({}, finRow), finRow2));
                });
            });
            //store somewhere for caching
            // console.log(requestQuery);
            // console.table(finData);
            var obj = {};
            obj["pin"] = pin;
            obj["data"] = finData;
            exports.db.update({ pin: pin }, { $set: { data: finData } }, { multi: true, upsert: true }, function (err, num, affectedDocs, upsert) {
                console.log(num, "Updated for ", pin, formatDate, "upsert?", upsert);
            });
        }
    })
        .catch(function (err) { return console.log(err); });
};
var caller = function (pin) {
    var today = new Date();
    getVacccineDates(pin, today);
    today.setDate(new Date().getDate() + 7);
    getVacccineDates(pin, today);
    today.setDate(new Date().getDate() + 14);
    getVacccineDates(pin, today);
    today.setDate(new Date().getDate() + 21);
    getVacccineDates(pin, today);
};
exports.caller = caller;
