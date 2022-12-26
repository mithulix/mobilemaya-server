const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 5000;
//mongo database require
const objectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbdbuji.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//db working/not
app.get("/",(req, res) => {
    res.send("----------------->>>  MobileMaya Server-Database connected!  <<<-----------------");
})


//DB connection between client-server
client.connect(err => {
  const mobileCollection = client.db("mobileMaya").collection("mobilemayaDB");
  const ordersCollection = client.db("mobileMaya").collection("orders");  

    //create data
    app.post('/addMobile',(req,res)=>{
        mobileCollection.insertOne(req.body)
        .then(result => { res.send(result.insertedCount > 0)})
    })
    app.post("/placeOrder", (req, res)=> {
      ordersCollection.insertOne(req.body)
      .then(result=> {res.send(result.insertedCount > 0)})
    })


    //read database
    app.get("/mobiles", (req, res) => {
        mobileCollection.find({})
        .toArray((err, documents) => {res.send(documents)})
    })
    app.get('/mobile/:id', (req, res)=>{
        mobileCollection.find({_id : ObjectId(req.params.id)})
        .toArray((err, documents)=>{ res.send(documents[0])})
    })
    app.get("/getOrders", (req, res) => {
      ordersCollection.find({email: req.query.email})
      .toArray((err, document) => {res.send(document)})
    })

    
    //delete data
    app.delete('/delete/:id',(req,res)=>{
        mobileCollection.deleteOne({_id : ObjectId(req.params.id)})
        .then(result => { res.send(result.deletedCount > 0) })
    })
    app.delete("/orderControl/:id", (req, res) => {
      ordersCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {res.send(result.deletedCount > 0)})
    })

});

app.listen(process.env.PORT || port)

