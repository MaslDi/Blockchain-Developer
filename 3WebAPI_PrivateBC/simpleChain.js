/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

const level = require('level');
const BCDB = './blockchaindata';
const db = level(BCDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  async addGenesisBlock() {
    const genesis_block = new Block("First block in the chain - Genesis block");
    genesis_block.height = 0;
    genesis_block.time = new Date().getTime().toString().slice(0,-3);
    genesis_block.hash = await SHA256(JSON.stringify(genesis_block)).toString();
    // Adding genesis block object to chain
    try {
      await db.put(genesis_block.height, JSON.stringify(genesis_block).toString());
      console.log("Genesis block added");
    } catch(err) {
      console.log("error inside addGenesisBlock:" + err);
    }

  }

    // Add new block
  async addBlock(newBlock) {

      // Block height
      try {
        const height = await this.getBlockHeight();
        //console.log("addBlock:Height="+height);
      // if no genesis block, first add that
      if (height === 0) {
        await this.addGenesisBlock();
        height ++;
      }
      newBlock.height = height;
  
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
  
      // previous block hash
      let prevBlock = await this.getBlock(newBlock.height-1);
      newBlock.previousBlockHash = prevBlock.hash;
  
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = await SHA256(JSON.stringify(newBlock)).toString();
      // Adding block object to chain
      await db.put(newBlock.height, JSON.stringify(newBlock).toString());
      } catch (err) {
        console.log("Error in AddBlock:"+err);
      }
  }

    // put block
  async putBlock(key, block) {
      try {
        const blockValue = JSON.stringify(block).toString();
        let result = await db.put(key, blockValue);
      } catch(err) {
        console.log("Error in putBlock:"+err);
      }
  }

  // Get block height
  getBlockHeight(){
    return new Promise(resolve => {
      let i = 0;
      db.createReadStream().on('data', (data) => {
            i++;
          }).on('error', (err) => {
              return console.log('Unable to read data stream!', err)
          }).on('close', () => {
            //console.log('Block Height' + i);
            resolve(i);
          });
    });
    
    // return this.chain.length-1;
  }

    // get block
  async getBlock(blockHeight) {
    try {
      let blockVal = await db.get(blockHeight);
      return JSON.parse(blockVal); 
    } catch(err) {
      console.log("Error in getBlock:"+err);
      return null;
    }
    // return object as a single string
     // return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  } 
    

    // validate block
  async validateBlock(blockHeight){
     
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = await SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
        return true;
        // resolve(true);
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
        // resolve (false);
      }

  }

  // Validate blockchain
  async validateChain(){
    let errorLog = [];
    const height = await this.getBlockHeight();
    let blockHash = '';
    let previousHash = '';
    for (var i = 0; i < height; i++) {
      // validate block
      if (!await this.validateBlock(i))errorLog.push(i);

      // get block with key=i
      let block = await this.getBlock(i);
      previousHash = block.previousBlockHash;
      if (blockHash!==previousHash) { // compare blocks hash link; except for genesis block
          errorLog.push(i);
      }
      blockHash = block.hash;
    }

    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }

}


module.exports = {
  Blockchain: Blockchain,
  Block: Block
 }