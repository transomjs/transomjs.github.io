---
title: Welcome to TransomJS
permalink: /docs/home/
redirect_from: /docs/index.html
---

### Introduction

Every Transom API follows the same pattern. We'll explain that pattern here and continue with a few simple examples.
Each TransomJS API consists of three components:
#### Transom Core
Core is responsible for creating and configuring the Restify server
#### Plugins
Plugins are responsible for adding end-points to the server
#### Configuration
Your configuration of the core and the plugins.


<div class="alert alert-info" role="alert">
  Official TransomJS modules are prefixed with the @transomjs namespace.
</div>

### Getting Set Up
First be sure you have [Node.js](http://nodejs.org/) installed.

Let's create a new folder and run `npm init` to create a `package.json` for a new Node project. Let's use `-y` to accept the defaults.
```bash
$ npm init -y
```
Next, install the Transom-Core module so we can create a basic server.

```bash
$ npm install --save @transomjs/transom-core
```

### Create the server
Create a `server.js` file and open it in your preferred editor.  We'll walk through the following steps to create and initialize a new Transom API server:
1. Create the Transom server using `transom-core`
2. Configure all the required Transom plugins. This adds the end-points to the API.
3. Supply the metadata for each of the plugins in the `definition` property of the `myApi.js` file.
4. Initialize the Transom server
5. Start the server

```javascript
// server.js

// Step 1.
// Require and instantiate transom using transom-core.
const Transom = require('@transomjs/transom-core');
const transom = new Transom();

// Step 2.
// Require and configure your plugins here as needed.
const magical = require('magical-example');
transom.configure(magical, {
  foo: 123
});

// Step 3.
// Require your api definition.
const myApi = require('./myApi');

// Step 4.
// Initialize transom and the plugins with the API metadata.
transom.initialize(myApi).then(function (server) {

  // Step 5.
  // Start the Transom server.
  server.listen(7090, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
});
```

### Write your API Definition
In the above example, we talked about requiring your API definition. Now we're going to provide an example of a simple api definition file. It's quite simply a JavaScript object that has the following structure. Properties in the `transom` node are used to configure transom-core, and properties in the `definition` node are used by the various plugins. By using JavaScript, rather than JSON, we are able to include comments and functions within the metadata, as well as requiring details from other files and applying unit tests to it as your project grows.

```javascript
// myApi.js

module.exports = {
  transom: {},
  definition: {}
}

```
You may have noticed that there aren't any endpoint definitions in this all-too-lightweight API Definition file. You'd be right. Endpoints are created by the Plugins you add to your server. During `transom.initialize()` a plugin will read the API definition and create the corresponding endpoints as indicated by the metadata for that plugin.

If you want to add CRUD enpoints to MongoDB collections, look at the [transom-mongoose](/docs/transom-mongoose/) plugin.  
```javascript
module.exports = {
  definition: {
    mongoose: {
      movies: {
        attributes: {
          title: "string",
          year: "number",
          genre: "string"
        }
      }			
    }
  }
};
```

Want to add and endpoint to do calculations or manipulate data beyond what CRUD can do? Look at the [transom-server-functions](/docs/transom-server-functions/) plugin.
```javascript
module.exports = {
  definition: {
    functions: {
      timesten: {
        methods: ["POST"],
        "function": function(server, req, res, next) {
          if (req.params["value"]) {
            const v = Number.parseFloat(req.params["value"]);
            res.send(v + " times ten is " + (v * 10) );
          } else {
            res.send("Value not provided");
          }
          next();
        } 
      }
    }
  }
};
```
Each plugin will have it's own metedata requirements but has access to the entire metedata object to use as needed. Documentation about metadata requirements for each individual plugin is included with the plugin. If you want to jump ahead, start with the details about [transom-core](/docs/transom-core/).