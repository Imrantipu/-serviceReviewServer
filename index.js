const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2xprxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try
    {
        const serviceCollection = client.db('emigrationHook').collection('services');
        const addServiceCollection = client.db('emigrationHook').collection('addservices');

        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const visaServices = await cursor.limit(3).toArray();
            res.send(visaServices);
        });
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.get('/addservice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.post('/addservice', async (req, res) => {
            const review = req.body;
            const result = await addServiceCollection.insertOne(review);
            res.send(result);
        });

        app.get('/review',  async (req, res) => {
             let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = addServiceCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        app.delete('/review/:id',async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addServiceCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Emigration server is running')
});

app.listen(port, () => {
    console.log(`Emigration  server is running on ${port}`);
});
