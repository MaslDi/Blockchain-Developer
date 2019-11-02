
const BlockchainClasses = require('./simpleChain.js');

const Block = BlockchainClasses.Block;
const Blockchain = BlockchainClasses.Blockchain;


//add "i" blocks to chain
async function createChain(chain, n) {
  let newBlock = new Block("Test Block - " + (n + 1));
  await chain.addBlock(newBlock);
  if (n < 10) {
    await createChain(chain, n+1);
  }
}


//print chain
async function printChain(chain, n) {
  let val = await chain.getBlock(n);
  console.log(val);
  if (n < 10) {
    await printChain(chain, n+1);
  }
}

async function modifyBlock(chain) {
  
  let inducedErrorBlocks = [2,4,7];
  
  for (var i = 0; i < inducedErrorBlocks.length; i++) {
    let block = await chain.getBlock(inducedErrorBlocks[i]);
    block.body = "induced chain error";
    await chain.putBlock(inducedErrorBlocks[i], block);
  }
  
}
/*=====  Testing the functionality =========================|
| add 10 new blocks to chain                                |
| print the chain value                                     |
| validate chain                                            |
| modify data in block 2, 4, 7                              |                                         |
|+=====  Testing the functionality ========================*/


setTimeout(async () => {
 
  console.log('');
  console.log('Blockchain:');
  console.log('');
  let blockchain = await new Blockchain();
  
  await createChain(blockchain, 0);
  await printChain(blockchain, 0);
 
  console.log('');
  console.log('');
  console.log('Validating blockchain....');
  await blockchain.validateChain();

  console.log('');
  console.log('Data before modification...');
  console.log(await blockchain.getBlock(1));
  console.log('');

  console.log('Modifying data in Block 2, 4, 7...');
  
  await modifyBlock(blockchain);
  console.log("Blockchain after modification...");
  console.log('');
  await printChain(blockchain, 0);
  console.log('');
  
  console.log('Validating blockchain after modification...')
  await blockchain.validateChain();
  console.log('');

}, 10000);
