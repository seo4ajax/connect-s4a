Connect-s4a
=============

[SEO4Ajax](https://www.seo4ajax.com) is a service that allows AJAX websites (e.g. based on Angular, React, Vue.js, Svelte, Backbone, Ember, jQuery etc.) to be indexable by search engines and social networks.

Connect-s4a is a middleware for the framework [Connect](https://github.com/senchalabs/connect). It provides an easy way to proxy bot requests to [SEO4Ajax](https://www.seo4ajax.com) in [NodeJS](https://nodejs.org/) applications.

Usage
-----

The middleware must required before connect or express.

With connect :

    var connect_s4a = require('connect-s4a');
    var token = "your site token on SEO4Ajax";
    var connect = require('connect');
    var app = connect();
    app.use(connect_s4a(token));
    app.use(function(req, res){
        res.end('hello world\n');
    });
    app.listen(3000);

With express 3.x:

    var connect_s4a = require('connect-s4a');
    var token = "your site token on SEO4Ajax";
    var express = require('express');
    var app = express.createServer();
    app.use(connect_s4a(token));
    app.get('/', function(req, res){
        res.send('hello world');
    });
    app.listen(3000);

With express 4.x:

    var connect_s4a = require('connect-s4a');
    var token = "your site token on SEO4Ajax";
    var express = require('express');
    var app = express();
    app.use(connect_s4a(token));
    app.get('/', function(req, res){
        res.send('hello world');
    });
    app.listen(3000);

With Meteor:

    import { WebApp } from 'meteor/webapp';
    import connect_s4a from 'connect-s4a';
    
    const token = "your site token on SEO4Ajax";
    
    Meteor.startup(() => {
        WebApp.connectHandlers.use(connect_s4a(token));    
    });

The `connect_s4a` function requrires one mandatory parameter: the token of the site on SEO4Ajax. The second parameter is optional, it is an object with the following property:

- `apiEndPoint`: URL to the API of SEO4Ajax (`"http://api.seo4ajax.com/"` by default)
- `rootPath`: a path added after the token when calling the API of SEO4Ajax (`""` by default)
- `includeUserAgents`: a regular expression used to test the user-agent value of bots (`/(bot|spider|pinterest|crawler|archiver|flipboard|mediapartners|facebookexternalhit|quora|whatsapp|outbrain|yahoo! slurp|embedly|developers.google.com\/+\/web/snippet|vkshare|w3c_validator|tumblr|skypeuripreview|nuzzel|qwantify|bitrix link preview|XING-contenttabreceiver|Chrome-Lighthouse|mail\.ru)/gi` by default),
- `ignoreUserAgents`: a regular expression used to ignore the user-agent value of bots

Installation
------------
Via npm :

    $ npm install connect-s4a

How it works
------------

This module checks the presence of a user-agent string identifying bots. If a bot is detected, the module requests the snapshot from api.seo4ajax.com and returns it. Otherwise the module ignores the request.


Requirements
------------

- node (>= 0.10.0)
- connect (>= 0.2.4) or express (>= 0.3.0)


Tests
-----

    node tests/run.js


License
-------

(The MIT License)

Copyright (c) 2013 Lormeau Gildas, Le Saout Yannick

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
