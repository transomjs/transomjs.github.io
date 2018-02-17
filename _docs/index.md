---
title: Welcome
permalink: /docs/home/
redirect_from: /docs/index.html
---

## Creating Transom APIs

### Introduction

Every Transom API follows the same pattern. We'll explain that pattern here and continue with a few simple examples.

The steps to create and initialize any Transom API server are:

1. Create the Transom server using `transom-core`
2. Configure all the required Transom plugins
3. Supply the metadata for each of the plugins in the `definition` property of the `myApi.js` file.
4. Initialize the Transom server
5. Start the server

First be sure you [Node.js](http://nodejs.org/) installed.

### Create our server
We need to create a server.js file and require our dependencies.
```javascript
// server.js

//Step 1.
const Transom = require('@transomjs/transom-core');
//create transom using transom-core
const transom = new Transom();

// require your plugins here as needed

//Step 2.
// configure each of the plugins.
transom.configure(plugin , options);

// Step 3.
// require our api definition
const myApi = require('./myApi');

// Step 4.
// Initialize my transom and the plgins with the API metadata.
transom.initialize(myApi).then(function (server) {
 
  // Step 5.
  // Start the Transom server...
  server.listen(7090, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
});
```
