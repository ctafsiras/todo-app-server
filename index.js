const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3csm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        client.connect();
        const taskCollection = client.db("todo").collection("tasks");

        //post task data api
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        //show task data api
        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.send(tasks);
        })


        //complete task data api
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: task,
            };
            const tasks = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(tasks);
        })

        //delete task data api
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(port, () => {
    console.log("listening to the ", port);
})