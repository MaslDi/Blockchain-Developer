
const express = require('express');
const bodyParser = require('body-parser');
const BlockchainClasses = require('./simpleChain.js');
const Mempool = require('./mempool.js');
const app = express();
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

// variable holding mempool
//const mempool = new Mempool();
let mempool = new Mempool();

// Routes for our api
// ====================================================
const router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'Blockchain API ' });
});


// ====================================================
// Post http://localhost:8000/requestValidation
// where body contains a json object { "address": "<new address>" }
// ====================================================
router.route('/requestValidation').post((req, res) => {
  const address=req.body.address;
  
  if (!address) {
    res.json({ message: "request body has no address" });
  } 
  // body contains address
  else {
    try {
      console.log(req.body);
      console.log(address);
      // send address to mempool
      res.json(mempool.addRequestValidation(address));
    } catch (err) {
      res.status(500).send("Mempool-addRequestValidation broke");
    }
  }
});

// ====================================================
// Post http://localhost:8000/message-signature/validate
// where body contains a json object { "address": "<new address>", 
//                                     "signature": "<signature>" }
// ====================================================
router.route('/message-signature/validate').post((req, res) => {
  const address = req.body.address;
  const signature = req.body.signature;
  if (!address || !signature) {
    res.json({message: "request body has no address or signature"});
  } else {
    res.json(mempool.validateRequestByWallet(address, signature));
  }
});

// ====================================================
// Post http://localhost:8000/block
// where body contains a json object { "address": "<new address>"
//                                     "star": {
//                                          "dec": "68° 52' 56.9",
//                                          "ra": "16h 29m 1.0s",
//                                          "story": "Found on google star"
//                                      }
//                                   }
// ====================================================
router.route('/block').post(async (req, res) => {
  const address = req.body.address;
  const star = req.body.star;
  if (!address || !star) {
    res.json({message: "request body has no address or star"});
  } 
  else if (!star.dec || !star.ra || !star.story ){
    res.json({message: "star: dec, ra, story missing"});
  } 
  else if (!mempool.verifyAddressRequest(address)) {
    // check if there is a verified request in mempool
      res.json({ message: "No verified request found" });
  } 
  else {
    // add new block to chain
    let storyDecoded = star.story.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
    // accept only 250 characters
    storyDecoded = storyDecoded.substring(0,250);
    const storyEncoded = Buffer(storyDecoded).toString('hex');
    const blockBody = {address, star}
    blockBody.star.story = storyEncoded;
    console.log('blockBody:'+ blockBody);
    const block = new Block(blockBody);
    try {
      const newBlock = await blockchain.addBlock(block);
      newBlock.body.star.storyDecoded = hex2ascii(newBlock.body.star.story);
      // remove the valid request from mempool
      mempool.removeAddressRequest(address);
      console.log("Added new Block:");
      console.log(newBlock);
      res.json(newBlock);
    } catch (err) {
      console.log("Error in post block:" + err);
      res.status(500).send("something broke in server");
    }
  }
});

// ====================================================
// Get http://localhost:8000/stars/hash:[HASH]
// ====================================================
router.route('/stars/hash::hash').get(async function(req, res) {
  console.log("need to fetch block with hash: " + req.params.hash);
  try {
    let block = await blockchain.getBlockByHash(req.params.hash);
    if (block) {
      block.body.star.storyDecoded = hex2ascii(block.body.star.story);
      res.json(block);
    } else {
      res.json({ message: 'block not found.'})
    }
  } catch (err) {
    //console.log(err);
    if (err.notFound) {
      res.status(404).send('block hash: "' + req.params.hash + '" not found' );
    } else {
      console.log("Error in getBlockByHash: "+ err);
      res.status(500).send("something broke in server");
    }
  }
});

// ====================================================
// Get http://localhost:8000/stars/address:[ADDRESS]
// ====================================================
router.route('/stars/address::address').get(async function(req, res) {
  console.log("need to fetch blocks with address: " + req.params.address);
  try {
    let blocks = await blockchain.getBlocksByAddress(req.params.address);
    if (blocks) {
      blocks.forEach(elem => {
        elem.body.star.decodedStory = hex2ascii(elem.body.star.story); 
      });
      res.json(blocks);
    } else {
      res.json({ message: 'blocks not found.'})
    }
  } catch (err) {
    //console.log(err);
    if (err.notFound) {
      res.status(404).send('block hash: "' + req.params.hash + '" not found' );
    } else {
      console.log("Error in getBlockByHash: "+ err);
      res.status(500).send("something broke in server");
    }
  }
});

// ====================================================
// Get http://localhost:8000/block/[HEIGHT]
// ====================================================
router.route('/block/:blockheight').get(async function(req, res) {
  console.log("need to fetch block: " + req.params.blockheight);
  try {
    let block = await blockchain.getBlock(req.params.blockheight);
    block.body.star.storyDecoded = hex2ascii(block.body.star.story);
    res.json(block);
  } catch (err) {
    //console.log(err);
    if (err.notFound) {
      res.status(404).send('block: "' + req.params.blockheight + '" not found' );
    } else {
      console.log("Error in getBlock: "+ err);
      res.status(500).send("something broke in server");
    }
  }
});


// configure api end point to base URL
app.use('/', router);

// Start Server
// ====================================================
(async () => {
 
  blockchain = await new Blockchain();
  
  // start api server and listen to requests at port=8000
  app.listen(port);
  console.log('Blockchain API server on localhost port ' + port);

})(1000);
