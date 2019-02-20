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

exports["urls filtered by user-agent properly proxified"] = {
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
    'Google bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Bing bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Google bot mobile': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Yandex bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Mail.RU bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +http://go.mail.ru/help/robots)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Pinterest iOS App': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/11A465 [Pinterest/iOS]'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Flipboard Android App': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SAMSUNG-SGH-I337 Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 Flipboard/2.2.3/2094,2.2.3.2094,2014-01-29 16:51, -0500, us'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Twitter bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Twitterbot/1.0'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Facebook bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Pinterest bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Pinterest/0.2 (+http://www.pinterest.com/)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Flipboard bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0 (FlipboardProxy/1.1; +http://flipboard.com/browserproxy)'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Generic bot': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'A string that contain the word bot ....'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Generic spider': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'A string that contain the word spider ....'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Generic crawler': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'A string that contain the word crawler ....'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Generic archiver': function (test) {
        var path = '/path/subpath';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'A string that contain the word archiver ....'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, '/' + s4aToken + path, 'the request should have been answered by the s4a api server');
                test.done();
            }
        });
    },
    'Static resources with 2 letters extension': function (test) {
        var path = '/path/subpath.js';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'Static resources with 3 letters extension': function (test) {
        var path = '/path/subpath.png';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'Static resources with 4 letters extension': function (test) {
        var path = '/path/subpath.html';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'Static resources with 2 letters extension and a query parameter': function (test) {
        var path = '/path/subpath.js?query=something';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'Static resources with 3 letters extension and a query parameter': function (test) {
        var path = '/path/subpath.png?query=something';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    },
    'Static resources with 4 letters extension and a query parameter': function (test) {
        var path = '/path/subpath.html?query=something';
        var uri = 'http://localhost:3000' + path;
        var requestObj = {
            uri: uri,
            headers: {
                'User-Agent': 'Any bot that get get filtered by its user-agent.'
            }
        };
        test.expect(1);
        request.get(requestObj, function (err, resp, body) {
            if (err) {
                test.ok(false, 'the request is in error : ' + err);
                test.done();
            } else {
                test.equals(body, 'connect server', 'the request should have been answered by the app server');
                test.done();
            }
        });
    }

};

exports['header properly sent'] = {
    setUp: function (ready) {
        var s4aAPI = connect();
        s4aAPI.use(function (req, res) {
            var path = url.parse(req.url).path;
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
                test.ok(jsonBody['x-forwarded-for'].indexOf('127.0.0.1') != -1, 'the x-forwarded-for header has not been added');
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
                test.ok(xForwardedFor[0].indexOf('127.0.0.1') != -1, 'the x-forwarded-for header has not been properly modified');
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
    });
    test.done();
};