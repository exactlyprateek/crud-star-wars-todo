const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://yoda:helloworld1@cluster0-9wmqg.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {  useUnifiedTopology: true});
MongoClient.connect("mongodb+srv://yoda:helloworld1@cluster0-9wmqg.mongodb.net/<dbname>?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  const db = client.db('star-wars-quotes') 
  const quotesCollection = db.collection('quotes')
app.set('view engine', 'ejs')  
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res)=> {
  db.collection('quotes').find().toArray().then(results =>{
    res.render('index.ejs', {quotes: results})
    })
    .catch(error => console.error(error))
    
  // res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req,res)=>{
  console.log(req.body)
  quotesCollection.insertOne(req.body)
    .then(result => {
        res.redirect('/')})
    .catch(error =>{ 
      console.error(error)
    })
       
})
app.put('/quotes', (req,res)=>{
  console.log(req.body)
  quotesCollection.findOneAndUpdate({name: 'yoda'},{$set :{name: req.body.name,quote: req.body.quote}}, {
      upsert: true
    })
    .then(result => {
      res.json("Success")
    })
    .catch(error => console.error(error))
  
})
app.delete('/quotes',(req,res)=>{
  quotesCollection.deleteOne({name: req.body.name}
  ).then(result => { 
    if (result.deletedCount === 0)
    {return res.json(`no more quotes to delete`)}
    res.json(`Darth Vader's quote deleted`)
  }).catch(error => {console.error()})
})
app.listen(3000, function() {
    console.log('listening on 3000')
  })
})
.catch(error => console.error(error))  
