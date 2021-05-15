import nedb from "nedb";

export const db = new nedb({
  filename: "./db.json",
  // NEED TO WRITE ENCRYPTION MODELS HERE
  // afterSerialization: function (plaintext) {

  // },
  // beforeDeserialization: function(ciphertext){

  // }
});

export const getAvailableSlots = (pin: string, phone: string) => {
  db.loadDatabase();
  db.persistence.compactDatafile();

  db.find({ district_id: parseInt(pin) }, (err: Error, docs: any) => {
    if (docs.length > 0) {
      const leads: any = docs[0].data.filter((l: any) => l.available > 0);
      // console.log(leads);
      if (leads.length > 0) {
        leads.forEach((element: any) => {
          console.log("Send notif to user: ", phone);
          const body = createMessageBody(element);
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;

          const client = require("twilio")(accountSid, authToken);

          console.log(body);

          client.messages
            .create({
              body: body,
              from: "+16789168968",
              to: "+91" + phone,
            })
            .then((message: any) => console.log(message.sid))
            .catch((err: any) => console.log(err));
        });
      } else {
        console.log("No Notif Required", phone, "district:", pin);
      }
    }
  });
};

const createMessageBody = (leads: any) => {
  let body = `${leads.available} slot(s) for ${leads.vaccine}(${leads.fee_type}) found on ${leads.date} at ${leads.name},${leads.address}, ${leads.district_name}. Open COWIN website/app to register now.`;
  return body;
};
