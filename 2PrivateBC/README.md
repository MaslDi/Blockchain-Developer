
Project II

#Creating your own Private Blockchain




### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].
```
npm -v
node -v
```

### Configuring Project Repository
- Go into project order
- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Testing

Run test script:

```
node testBC.js
```
Steps in test script:

1: Create Chain with 10 blocks using loop to add blocks

2: Print Chain

3: Validate Chain 
Output should be: "No errors should be detected"

4: Modification - Induce errors by changing block data in Block 2, 4, 7
```
let inducedErrorBlocks = [2,4,7];
  
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  let block = await chain.getBlock(inducedErrorBlocks[i]);
  block.body = "induced chain error";
  await chain.putBlock(inducedErrorBlocks[i], block);
}
```
   
5: Validate Chain after modification. The chain should now fail with blocks 2,4, and 7.
