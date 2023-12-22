const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbcjxfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const createTask = client.db('task-sync').collection('allTask')


    app.post('/createTask', async (req, res) => {
      const item = req.body;
      const result = await createTask.insertOne(item);
      res.send(result)
    })

    app.get('/myTask', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await createTask.find(query).toArray()
      res.send(result)
    })

    app.get('/myTask/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await createTask.findOne(query)
      res.send(result)
  })

    app.delete('/myTask/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await createTask.deleteOne(query)
      res.send(result)
  })

  app.patch('/myTask/:id', async (req, res) => {
    const item = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updatedDoc = {
        $set: {
            title: item.title,
            status: item.status,
            description: item.description,
            dateline: item.dateline,
            priority: item.priority,
        }
    }
    const result = await createTask.updateOne(filter, updatedDoc)
    res.send(result)
})

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('TaskSync is running')
})

app.listen(port, () => { })