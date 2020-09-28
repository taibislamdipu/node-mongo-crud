
const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'L8R6nb$NdDWXdx';

const uri = "mongodb+srv://organicUser:L8R6nb$NdDWXdx@cluster0.is4kq.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    // get or Read Data , lading all data on my collection
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    // update product , specific product update using id
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    // post or Insert product
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully');
                // res.send('success');
                res.redirect('/');
            })
        console.log(product);
    })

    // update
    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                // console.log(result);
                res.send(result.modifiedCount > 0)
            })
    })


    // delete
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        // const id = req.params.id;
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                // console.log(result);
                res.send(result.deletedCount > 0);
            })
    })


});

app.listen(port);