const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 4030;

// middlewere
app.use(cors());
app.use(express.json());

// name: crudPractice
// pass: t88J58OzbpDZlGx1

const uri =
  "mongodb+srv://crudPractice:t88J58OzbpDZlGx1@cluster0.8ax4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("productdb");
    const productCollection = database.collection("products");

    // get method
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const product = req.params.id;
      const query = { _id: ObjectId(product) };
      const result = await productCollection.findOne(query);
    });

    // post method
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log("hitting the post ", result);
      res.send(result);
    });

    // update method
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
          quantity: updatedProduct.quantity,
        },
      };
      // console.log("updating user", req);
      const result = await productCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // delete method
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete the id", id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      // console.log("deleting the desired product", result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
