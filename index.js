import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv'
dotenv.config()
let hallapp = express()

let port = process.env.PORT;

// Home page
hallapp.get("/", (req, res) => {
    res.send("Welcome to test app 🎉🎉")
})
// mongo connection.
let mongo = process.env.MONGO_URL
let client = new MongoClient(mongo);
await client.connect();
console.log(" MongoDb Connected ✨🎉");

// Connection With Server
hallapp.listen(4000, () => {
    console.log("Server Started 💥");
})
// show all  rooms.
hallapp.get("/rooms", async (req, res) => {
    let data = await client.db("hallapp").collection("rooms").find({}).toArray();
    res.send(data)

    // console.log(client);
});

// show all Booked rooms.
hallapp.get("/rooms/booked", async (req, res) => {
    let data = await client.db("hallapp").collection("rooms").find({ "booked": { $nin: [""] } }).toArray();

    res.send(data)

    // console.log(client);
});
// Create Rooms
hallapp.post("/rooms/create", express.json(), async (req, res) => {
    let data = req.body;
    let result = await client.db("hallapp").collection("rooms").insertOne(data);
    res.send("Sucess")
    console.log(result);
})
// Books Rooms
hallapp.post("/rooms/book", express.json(), async (req, res) => {
    let data = req.body;

    let result = await client.db("hallapp").collection("rooms").updateOne({ "id": data.roomid }, { $set: { "booked": data.customerid, "customer": data.name, "date": data.date, "start": data.start, "end": data.end } });
    let result2 = await client.db("hallapp").collection("customers").insertOne({ "booked": data.roomid, "name": data.name, "id": data.customerid, "date": data.date, "start": data.start, "end": data.end });
    res.send(result)
    console.log(data);
})
// Booked Rooms
hallapp.get("/rooms/booked", async (req, res) => {
    // db.rooms.find({"booked":""})
    let data = await client.db("hallapp").collection("rooms").find({ "booked": { $nin: [""] } }).toArray();
    data.length > 0 ? res.send(data) : res.send("No room Booked")
})

// Booked Customers.

hallapp.get("/rooms/customers", async (req, res) => {
    let data = await client.db("hallapp").collection("customers").find({}).toArray();
    res.send(data)
})




