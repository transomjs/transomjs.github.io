---
title: Hello World
permalink: /docs/hello-world/
redirect_from: /docs/hello-world.html
---

### A simple server function
The code in this article is [available in this repo](https://github.com/binaryops-wiebo/transom-functions-simple-example)

First be sure you have [Node.js](http://nodejs.org/) installed.

Let's create a new folder and run `npm init` to create a package.json for a new Node project. I'll use `-y` to choose the defaults.

```bash
$ npm init -y
```
Next, install Transom-Core and the Transom-server-functions plugin so we can create a REST API using our own function implementation.

```bash
$ npm install --save @transomjs/transom-core @transomjs/transom-server-functions
```

### Create our server
We need to create an index.js file and require our dependencies.
```javascript
// index.js

const Transom = require('@transomjs/transom-core');
const transomMongoose = require('@transomjs/transom-server-functions');
const myApi = require('./myApi');
```

Next, we need to instantiate Transom, register TransomMongoose with the Core.
```javascript
const transom = new Transom();

// Register my TransomJS server functions plugin.
transom.configure(transomServerFunctions);
```

Now we can initialize the API definition. You'll notice that `transom.initialize()` is asynchronous and returns a Promise. When it resolves, we can start listening for requests.

```javascript
// Initialize my TransomJS API metadata.
transom.initialize(myApi).then(function (server) {

  // Start the Transom server...
  server.listen(7090, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
});
```

### Define our API
Create a new file called myApi.js in which we'll add a definition for the `hello` function. We'll include a second function that does a simple math multiplication, just for fun.
```javascript
// myApi.js
module.exports = {
  note: "This is a simple TransomJS example that uses the Server Functions module to implement Hello World",
  name: "My functions Example App",
  transom: {},
  definition: {
      functions: {
        hello:{
          methods: ["GET"],
          "function": function(server, req, res, next) {
            res.send("hello world");
            next();
          }
        }
      }  
    }
};
```

### Running the Hello World API
At this point you should be able to run the API from the command line with `node index.js`.

