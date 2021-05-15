import axios from "axios";
import requestHeaders from "../headerconfigs/requestHeaders.json";
import dateformat from "dateformat";
import nedb from "nedb";

export const db = new nedb({
  filename: "./db.json",
  // NEED TO WRITE ENCRYPTION MODELS HERE
  // afterSerialization: function (plaintext) {

  // },
  // beforeDeserialization: function(ciphertext){

  // }
});

const getVacccineDates = (pin: string, date: Date) => {
  db.loadDatabase();
  db.persistence.compactDatafile();

  const formatDate = dateformat(date, "dd-mm-yyyy");
  const requestQuery = `district_id=${pin}&date=${formatDate}`;

  console.log(requestQuery);
  let dat: any;
  axios
    .get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?${requestQuery}`,
      {
        headers: requestHeaders,
      }
    )
    .then((response) => {
      //looping thru the data
      dat = response.data;
      let finData: any = [];
      if (response.data.centers.length > 0) {
        response.data.centers.forEach((element: any) => {
          let finRow: any = {};

          finRow.name = element.name;
          finRow.address = element.address;
          finRow.state_name = element.state_name;
          finRow.district_name = element.district_name;
          finRow.pincode = element.pincode;
          finRow.fee_type = element.fee_type;

          const sessions = element.sessions;
          // console.log(finRow);

          sessions.forEach((ses: any) => {
            let finRow2: any = {};
            finRow2.date = ses.date;
            finRow2.available = ses.available_capacity;
            finRow2.min_age = ses.min_age_limit;
            finRow2.vaccine = ses.vaccine;
            finRow2.fees =
              element.fee_type == "Paid"
                ? element.vaccine_fees == undefined
                  ? "Unknown"
                  : element.vaccine_fees.filter(
                      (v: any) => v.vaccine == finRow2.vaccine
                    )[0].fee
                : 0;

            finData.push({ ...finRow, ...finRow2 });
          });
        });

        //store somewhere for caching
        // console.log(requestQuery);
        // console.table(finData);
        let obj: any = {};
        obj["pin"] = pin;
        obj["data"] = finData;

        db.update(
          { district_id: pin },
          { $set: { data: finData } },
          { multi: true, upsert: true },
          (err: any, num: any, affectedDocs: any, upsert: boolean) => {
            console.log(
              num,
              "Updated for ",
              pin,
              formatDate,
              "upsert?",
              upsert
            );
          }
        );
      }
    })
    .catch((err) => console.log(dat, err));
};

export const caller = (pin: string) => {
  let today = new Date();
  getVacccineDates(pin, today);
  today.setDate(new Date().getDate() + 7);
  getVacccineDates(pin, today);
  today.setDate(new Date().getDate() + 14);
  getVacccineDates(pin, today);
  today.setDate(new Date().getDate() + 21);
  getVacccineDates(pin, today);
};
