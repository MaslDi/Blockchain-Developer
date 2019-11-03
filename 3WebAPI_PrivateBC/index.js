
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const BlockchainClasses = require('./simpleChain.js');
const Block = BlockchainClasses.Block;
const Blockchain = BlockchainClasses.Blockchain;

// configure app to use bodyParser()
// this will allow us to get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port
const port = 8000;

// variable holding blockchain instance
// will be initialised in a async function at the time of 
// starting the server at the end of this file
let blockchain = null;

// Create Chain

//add "i" blocks to chain
async function createChain(chain, n) {
  let newBlock = new Block("Test Block - " + (n + 1));
  await chain.addBlock(newBlock);
  if (n < 2) {
    await createChain(chain, n+1);
  }
}

//print chain
async function printChain(chain, n) {
  let val = await chain.getBlock(n);
  console.log(val);
  if (n < 2) {
    await printChain(chain, n+1);
  }
}


// Routes for our api
// ====================================================
const router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'Blockchain API - Get /block/:id to retrieve a block. Post /block to add a new block.' });
});

// configure api end point to base URL
app.use('/', router);

// ====================================================
// GET http://localhost:8000/block/:id
// Return the block with blockheight = id
// ====================================================
router.route('/block/:blockheight').get(async function(req, res) {
  console.log("need to fetch block: " + req.params.blockheight);
  try {
    let block = await blockchain.getBlock(req.params.blockheight);
    res.json(block);
  } catch (err) {
    //console.log(err);
    if (err.notFound) {
      res.status(404).send('block: "' + req.params.blockheight + '" not found' );
    } else {
      res.status(500).send("Something broke in server");
    }
  }
});

// Register routes
// ====================================================
// Post http://localhost:8000/block
// where body contains a json object { body: "<new block message>" }
// ====================================================
router.route('/block').post(async function(req, res) {

  let body = req.body.body;
  
  // check if body contains a json object with a key "body"
  // trim the value to remove leading and trailing spaces
  if (body) {
    body = body.trim();
  }
  // check request has an empty message. If so do not create the block
  if (!body) {
    res.json({ message: "Cannot add empty block." });
  } else {
    // all good. Now create a new block and persist the block in levelDB
    const block = new Block(body);
    try {
      const newBlock = await blockchain.addBlock(block);
      console.log("Added new Block:");
      console.log(req.body);
      res.json(newBlock);
    } catch (err) {
      res.status(500).send("Something broke in server");
    }
  }

});

let start = true;

// Start Server
// ====================================================
setTimeout(async () => {
 
  if(start){
    console.log('');
    console.log('Blockchain:');
    console.log('');
    blockchain = await new Blockchain();
    
    await createChain(blockchain, 0);
    await printChain(blockchain, 0);
  
    console.log('');
    console.log('');
    console.log('Validating blockchain....');
    await blockchain.validateChain();
    start=false;
  }
  

  // start api server and listen to requests at port=8000
  app.listen(port);
  console.log('Blockchain API server on localhost port ' + port);


}, 10000);