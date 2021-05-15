import nedb from "nedb";

export const db = new nedb({
  filename: "./db.json",
  // NEED TO WRITE ENCRYPTION MODELS HERE
  // afterSerialization: function (plaintext) {

  // },
  // beforeDeserialization: function(ciphertext){

  // }
});

export const getAvailableSlots = (pin: string) => {
  db.loadDatabase();
  db.persistence.compactDatafile();

  db.find({ pin: parseInt(pin) }, (err: Error, docs: any) => {
    if (docs.length > 0) {
        // log
      const leads = docs[0].data.filter((l: any) => l.available > 0);
      console.log(leads);
    }
  });
};
