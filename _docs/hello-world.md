---
title: Hello World
permalink: /docs/hello-world/
redirect_from: /docs/hello-world.html
---

## TransomJS without a MongoDB

First be sure you have [Node.js](http://nodejs.org/) installed.
<!-- You can get a full copy of the code in this article here. -->


Let's create a new folder and run `npm init` to create a package.json for a new Node project. I'll use `-y` to choose the defaults.

```bash
$ npm init -y
```
Next, install Transom-Core and the Transom-Mongoose modules so we can create a REST API to use our MongoDB database.

```bash
$ npm install --save @transomjs/transom-core @transomjs/transom-mongoose
```

### Create our server
We need to create a server.js file and require our dependencies.
```javascript
// server.js

const Transom = require('@transomjs/transom-core');
const transomMongoose = require('@transomjs/transom-mongoose');
const myApi = require('./myApi');
```

Next, we need to instantiate Transom, register TransomMongoose with the Core.
```javascript
const transom = new Transom();

// Register my TransomJS Mongoose module.
transom.configure(transomMongoose, {
  mongodbUri: 'mongodb://localhost/example-app'
});
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
Create a new file called myApi.js in which we'll add a definition for a Mongoose Model that we can use to document our flegling movie collection. We can even include some seed data so our database doesn't  start out empty.
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

$ touch server.js
$ touch api.js




[GitHub Pages](https://pages.github.com) can automatically generate and serve the website for you.
Let's say you have a username/organisation `my-org` and project `my-proj`; if you locate Jekyll source under `docs` folder of master branch in your repo `github.com/my-org/my-proj`, the website will be served on `my-org.github.io/my-proj`.
The good thing about coupling your documentation with the source repo is, whenever you merge features with regarding content to master branch, it will also be published on the webpage instantly.

1. Just download the source from [github.com/aksakalli/jekyll-doc-theme](https://github.com/aksakalli/jekyll-doc-theme/master) into your repo under `docs` folder.
2. Edit site settings in  `_config.yml` file according to your project. !!! `baseurl` should be your website's relative URI like `/my-proj` !!!
3. Replace `favicon.ico` and `img/logonav.png` with your own logo.

## Writing content

### Docs

Docs are [collections](https://jekyllrb.com/docs/collections/) of pages stored under `_docs` folder. To create a new page:

**1.** Create a new Markdown as `_docs/my-page.md` and write [front matter](https://jekyllrb.com/docs/frontmatter/) & content such as:

```
---
title: My Page
permalink: /docs/my-page/
---

Hello World!
```

**2.** Add the pagename to `_data/docs.yml` file in order to list in docs navigation panel:

```
- title: My Group Title
  docs:
  - my-page
```

### Blog posts

Add a new Markdown file such as `2017-05-09-my-post.md` and write the content similar to other post examples.

### Pages

The homepage is located under `index.html` file. You can change the content or design completely different welcome page for your taste. (You can use [bootstrap components](http://getbootstrap.com/components/))

In order to add a new page, create a new `.html` or `.md` (markdown) file under root directory and link it in `_includes/topnav.html`.
