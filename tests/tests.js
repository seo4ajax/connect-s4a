var connect_s4a = require('../lib/connect-s4a.js');
var s4aToken = 'token';
var connect = require('connect');
var request = require('request');
var url = require('url');





exports["_escaped_fragment_ urls properly proxified"] = {
    setUp: function (ready) {
        var s4aAPI = connect();
        s4aAPI.use(function (req, res) {
            var path = url.parse(req.url).path;
            res.setHeader('Server', 'api');
            res.end(path);
        });
        this.apiServer = s4aAPI.listen(3001);

        var app = connect();
        app.use(connect_s4a(s4aToken, {
            apiEndPoint: 'http://localhost:3001/'
        }));
        app.use(function (req, res) {
            res.setHeader('Server', 'app');
            res.end('connect server');
        });
        this.connectServer = app.listen(3000);

        ready();
    },
    tearDown: function (done) {
        var self = this;
        self.apiServer.close(function () {
            self.connectServer.close(function () {
                done();
            });
        });
    },
    'without _escaped_fragment_': function (test) {
        var path = '/path?withQuery=parameter';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'with _escaped_fragment_': function (test) {
        var path = '/path?_escaped_fragment_=fragment';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    '_escaped_fragment_ without value': function (test) {
        var path = '/path?_escaped_fragment_=';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    '_escaped_fragment_ as a second parameter': function (test) {
        var path = '/path?param1=val1&_escaped_fragment_=';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'token well added': function (test) {
        var path = '/path?param1=val1&_escaped_fragment_=';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body.split('/')[1], s4aToken, 'the token is not well added in the url request to the s4a api server');
                test.done();
            }
        });
    },
    'with a HEAD request': function (test) {
        var path = '/path?param1=val1&_escaped_fragment_=';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.head(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(resp.headers.server, 'api', 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'with a POST request': function (test) {
        var path = '/path?param1=val1&_escaped_fragment_=';
        var uri = 'http://localhost:3000' + path;
        test.expect(1);
        request.post(uri, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(resp.headers.server, 'app', 'the request should have been answered by the app server');
                test.done();
            }
        });
    }
};

exports['header properly sent'] = {
    setUp: function (ready) {
        var s4aAPI = connect();
        s4aAPI.use(function (req, res) {
            var path = url.parse(req.url).path
            res.end(JSON.stringify(req.headers));
        });
        this.apiServer = s4aAPI.listen(3001);

        var app = connect();
        app.use(connect_s4a(s4aToken, {
            apiEndPoint: 'http://localhost:3001/'
        }));
        app.use(function (req, res) {
            res.end('connect server');
        });
        this.connectServer = app.listen(3000);

        ready();
    },
    tearDown: function (done) {
        var self = this;
        self.apiServer.close(function () {
            self.connectServer.close(function () {
                done();
            });
        });
    },
    'headers from origin request': function (test) {
        var uri = 'http://localhost:3000/?_escaped_fragment_=';
        var headers = {
            'content-type': 'content-type',
            'user-agent': 'user-agent'
        };
        test.expect(2);
        request.get(uri, {
            headers: headers
        }, function (err, resp, body) {
            var jsonBody;
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                jsonBody = JSON.parse(body);
                test.equals(jsonBody['content-type'], 'content-type', 'the content-type header has not been sent');
                test.equals(jsonBody['user-agent'], 'user-agent', 'the user-agent header has not been sent');
                test.done();
            }
        });
    },
    'x-forwarded-for added': function (test) {
        var uri = 'http://localhost:3000/?_escaped_fragment_=';
        test.expect(1);
        request.get(uri, function (err, resp, body) {
            var jsonBody;
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                jsonBody = JSON.parse(body);
                test.equals(jsonBody['x-forwarded-for'], '127.0.0.1', 'the x-forwarded-for header has not been added');
                test.done();
            }
        });
    },
    'x-forwarded-for already present': function (test) {
        var uri = 'http://localhost:3000/?_escaped_fragment_=';
        test.expect(3);
        var headers = {
            'x-forwarded-for': ['10.0.0.2', '10.0.0.1']
        };
        request.get(uri, {
            headers: headers
        }, function (err, resp, body) {
            var jsonBody, xForwardedFor;
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                jsonBody = JSON.parse(body);
                xForwardedFor = jsonBody['x-forwarded-for'].split(', ');
                test.equals(xForwardedFor[0], '127.0.0.1', 'the x-forwarded-for header has not been properly modified');
                test.equals(xForwardedFor[1], '10.0.0.2', 'the x-forwarded-for header has not been properly modified');
                test.equals(xForwardedFor[2], '10.0.0.1', 'the x-forwarded-for header has not been properly modified');
                test.done();
            }
        });
    }
};

exports['not follow redirect'] = function (test) {
    var setUp = function (ready) {
        var s4aAPI = connect();
        s4aAPI.use(function (req, res) {
            res.statusCode = 302;
            res.setHeader('location', 'http://example.com/');
            res.end('redirect');
            //res.end(JSON.stringify(req.headers));
        });
        this.apiServer = s4aAPI.listen(3001);

        var app = connect();
        app.use(connect_s4a(s4aToken, {
            apiEndPoint: 'http://localhost:3001/'
        }));
        app.use(function (req, res) {
            res.end('connect server');
        });
        this.connectServer = app.listen(3000);

        ready();
    };
    var tearDown = function (done) {
        var self = this;
        self.apiServer.close(function () {
            self.connectServer.close(function () {
                done();
            });
        });
    };
    var uri = 'http://localhost:3000/?_escaped_fragment_=';
    test.expect(2);
    setUp(function () {
        request.get(uri, {
            followRedirect: false
        }, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(resp.headers.location, 'http://example.com/', 'the location header should be specified');
                test.equals(resp.statusCode, 302, 'the statusCode should be 2');
                tearDown(test.done);
            }
        });
    });
};

exports['throws error if no token'] = function (test) {
    test.expect(1);
    test.throws(function () {
        connect_s4a();
        console.log("eeee");
    });
    test.done();
};