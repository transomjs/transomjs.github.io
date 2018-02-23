---
title: Welcome to TransomJS
permalink: /docs/home/
redirect_from: /docs/index.html
---

### Introduction
TransomJS is a library for building REST APIs with Javascript. You tell it what you want with configuration details and it does the heavy lifting for you. You get to write your custom code and add it to the API.
A REST API developed using TransomJS API will consist of three primary components: Configuration, Core & Plugins.

#### Configuration
Your configuration (aka API definition) is a JavaScript object (with a basic pre-defined structure) that can be composed however you like. Configuation data typically consists of static data elements and functions. It's recommended to start with a single file that exports your configuration and expand as needed when your application grows.

#### Core
Transom Core is responsible for loading and initializing plugins as well as configuring the Restify server. Plugins must be registered with the core where they are configured and then initialized. During initialization they have full access to the configuration data to determine which routes to add to the server. A key component of the server is the `registry`. The registry is a global object store where plugins have access to shared Objects that can be used throughout the application.

#### Plugins
Plugins are responsible for adding end-points to the server
Plugins are independant Javascript Objects that can be initialized by the Transom server. When a plugin is initialized, it has access to both the server instance and the entire configuration data object. Using details found in the configuration, a plugin is able to attach routes (REST endpoints) to the server and create client Object instances in the server registry.


<div class="alert alert-info" role="alert">
  Official TransomJS plugins are prefixed with the @transomjs namespace.
</div>

### Getting Set Up
First, be sure you have [Node.js](http://nodejs.org/) installed.

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
Each plugin will have it's own metadata requirements but has access to the entire metadata object to use as needed. Documentation about metadata requirements for each individual plugin is included with the plugin. If you want to jump ahead, start with the details about [transom-core](/docs/transom-core/).