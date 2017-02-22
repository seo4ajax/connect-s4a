Connect-s4a
=============

[SEO4Ajax](https://www.seo4ajax.com) is a service that let you get full visibility on search engines, social networks and display advertising of any AJAX website based on Angular, React, Backbone, Ember, jQuery etc.

Connect-s4a is a middleware for Connect framework. It provides an easy way to
proxify GET requests from non-js clients (e.g. crawlers) to [SEO4Ajax](https://www.seo4ajax.com).

Usage
-----

This middleware must be on the first called.

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

Connect-s4a take only one parameter, the token of the site on SE04Ajax.


Installation
------------
Via npm :

    $ npm install connect-s4a

How it works
------------

This module checks the presence of the _escaped_fragment_ query parameter or the presence of a user-agent string identifying bots that do not support the Ajax Crawling Specification.
If the _escaped_fragment_ is present or a bot is detected, it requests the snapshot on SEO4Ajax and responds to the initial request with the concerned snapshot.


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
