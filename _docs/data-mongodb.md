---
title: TransomJS with MongoDB
permalink: /docs/data-mongodb/
---

### Get Set Up
First be sure you have [Node.js](http://nodejs.org/) and a MongoDB server that we can connect to for developement.

Create a new folder and run `npm init` to create a package.json for a new Node project. Use `-y` to choose the defaults.

```bash
$ npm init -y
```
Next, install Transom-Core and the Transom-Mongoose plugin so we can add MongoDB CRUD endpoints to our REST API.

```bash
$ npm install --save @transomjs/transom-core @transomjs/transom-mongoose
```

### Create our server
We need to create a server.js file and require our dependencies.
```javascript
// server.js

const Transom = require('@transomjs/transom-core');
const transomMongoose = require('@transomjs/transom-mongoose');
```

Next, we need to instantiate Transom and configure TransomMongoose. Update below to use the URL for your development server. If you have MongoDB running locally, the default should be fine.
```javascript
const transom = new Transom();

// Register my TransomJS Mongoose module.
transom.configure(transomMongoose, {
  mongodbUri: 'mongodb://localhost/example-app'
});
```

Now we can initialize the API configuration. You'll notice that `transom.initialize()` is asynchronous and returns a Promise. When it resolves, we can start listening for requests.

```javascript
// Require and initialize my TransomJS API configuration.
const myApi = require('./myApi');
transom.initialize(myApi).then(function (server) {

  // Start the Transom server...
  server.listen(7090, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
});
```

### Define our API
Create a new file called myApi.js in which we'll add a definition for a Mongoose Model that we can use to document our fledgling movie collection. We can even include some seed data so our database doesn't start out empty.
```javascript
// myApi.js

module.exports = {
  definition: {
    mongoose: {
      movies: {
        attributes: {
          title: "string",
          year: "number",
          genre: "string"
        },
        seed: [
          {title: "Airplane!", year: 1980, genre: "comedy"},
          {title: "Doctor Zhivago", year: 1965, genre: "drama"},
          {title: "Avatar", year: 2009, genre: "action"}
        ]
      }      
    }
  }
};
```
#### CRUD Endpoints
This is where I need to stop and explain things a bit. We mention earlier in the documentation how it's the responsibility of plugins to add routes to the server. The Transom-Mongoose plugin is one that adds a whole bunch of routes.
When we defined `mongoose.movies` in the file above, Transom-Mongoose used that information to create a Mongoose Model and added CRUD routes to the server that provide access to the movies collection in MongoDB. Each of the routes below will apply request parameters that correspond with the related model as query arguments or to validate data for Insert and Update functions.  See [/docs/transom-mongoose/](Transom-Mongoose) for details about what's available and how to use some of the more complex features of the plugin.

##### Create

 * server.post(`${uriPrefix}/db/${route.entity} **//insert single**

##### Read

 * server.get(`${uriPrefix}/db/${route.entity} **// find query**
 * server.get(`${uriPrefix}/db/${route.entity}/count **// count query**
 * server.get(`${uriPrefix}/db/${route.entity}/:__id/:__attribute/:__filename **// find single binary**
 * server.get(`${uriPrefix}/db/${route.entity}/:__id **// find single**

##### Update

 * server.put(`${uriPrefix}/db/${route.entity}/:__id **// update single**

##### Delete

 * server.del(${uriPrefix}/db/${route.entity} **// delete query - Yikes!**
 * server.del(${uriPrefix}/db/${route.entity}/batch **// delete batch**
 * server.del(${uriPrefix}/db/${route.entity}/:__id **// delete single**

#### Seed Data
During the `transom.initialize` step, Transom-Mongoose examines the movies collection and, if it's got no records in it, the plugin inserts the seed data using the corresponding mongoose model. If `movies.seed` is missing or the MongoDB collection is not empty, the collection is left alone.

#### Complex Data Manipulations
In simple cases CRUD data access works great, but when developing more complex applications it's not uncommon to have endpoints that affect multiple records or do calculations based on stored data. Using the server registry it's possible to fetch Models from mongoose and use them in your own endpoints or within routes defined by [Transom-server-functions](/docs/transom-server-functions/);

```javascript
server.get('groupBySpecies', function (req, res, next) {
  const mongoose = server.registry.get('mongoose');
  const Animals = mongoose.model('dynamic-animals')

  Animals.find({}, function (err, items) {
    if (err) {
      return next(err);
    }
    const result = {};
    for (var animal of items) {
      if (!result[animal.species]) {
        result[animal.species] = [];
      }
      result[animal.species].push(animal);
    }
    res.send(result);
  });
});
```

#### Wrap-up
This was quick introduction to demonstrate how to use TransomJS with a Mongo database. In the example we created a server and initialized the plugin to create mongoose models. We provided some seed data to populate our collection and presented a list of routes that are provided for you automatically by the plugin. The complex data manipulation example was a simple demonstration of how things are provided for  you but you still have access to everything you would if you'd written the schemas and added them to mongoose yourself. As with everything there's a trade-off convenience and freedom, we've tried to give you the best of both providing a lot of functionality out of the box, and then giving you the freedom to add your own functions as necessary.
