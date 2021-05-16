import { getAvailableSlotsFromDB } from "./DBConnect";

export const getAvailableSlots = (pin: number, phone: string) => {
  getAvailableSlotsFromDB(pin).then((res) => {
    if (res.length < 1) {
      console.log("No message for ", pin);
    }
    res.forEach((leads) => {
      const body = createMessageBody(leads);
      console.log(body);
      // sendTextMessage(body, phone);
    });
  });
};

const createMessageBody = (leads: any) => {
  let body = `${leads.available} slot(s) for ${leads.vaccine}(${leads.fee_type}) found on ${leads.date} at ${leads.name},${leads.address}, ${leads.district_name}. Open COWIN website/app to register now.`;
  return body;
};
const sendTextMessage = (body: string, phone: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const client = require("twilio")(accountSid, authToken);

  

  client.messages
    .create({
      body: body,
      from: "+16789168968",
      to: "+91" + phone,
    })
    .then((message: any) => console.log(message.sid))
    .catch((err: any) => console.log(err));
};
