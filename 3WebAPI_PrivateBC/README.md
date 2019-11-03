
Project III

# Web API for Private BC

RESTful Web API with ExpressJS-Framework

#### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].
```
npm -v
node -v
```

#### Configuring Project Repository
- Go into project order
- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```



### Endpoints (GET / POST)

#### GET Block Endpoint

The web API contains a GET endpoint that responds to a request using a URL path with a block height parameter or properly handles an error if the height parameter is out of bounds.

Create blockchain with height=2

The response for the endpoint provides a block object in JSON format.

```
node index.js
```


Access blocks: e.g. Open URL
http://localhost:8000/block/0


Response:

```
{
"hash":" ... ",
"height":0,
"body":"First block in the chain - Genesis block",
"time":" ... ",
"previousBlockHash":""
}
```


#### POST Block Endpoint

The web API contains a POST endpoint that allows posting a new block with the data payload option to add data to the block body. Block body should support a string of text.



Open Postman (https://www.getpostman.com)

1. POST http://localhost:8000/block
2. Body + raw + JSON (application/json)
```
{ "body": "Add new block into chain" }
```
3. Send
4. New block is added


