import { MongoClient } from "mongodb";

let dbCon: MongoClient;

export async function connect() {
  const uri = process.env.MONGO_URI!;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    // Connect the client to the server
    dbCon = await client.connect();
    console.log("Connected successfully to server");
    return dbCon;

    
  } catch (err) {
    console.log(err);
  }
}

export async function addCowin(pin: string, finData: any) {
  const collection = dbCon.db("cowinDB").collection("cowinCache");
  await collection.updateOne(
    { district_id: pin, address: finData.address },
    { $set: { district_id: pin, ...finData } },
    { upsert: true }
  );
  // console.log("Inserted");
}

export async function getAvailableSlotsFromDB(district_id: number) {
  const filter = { district_id: district_id, available: { $gt: 0 } };
  const collection = dbCon.db("cowinDB").collection("cowinCache");

  const cursor = await collection.find(filter).toArray();
  console.log(cursor);

  return cursor;
}

export async function getUsersFromDB() {
  const collection = dbCon.db("cowinDB").collection("users");
  const cursor = await collection.find().toArray();
  console.log(cursor.length, "Users");
  return cursor;
}
