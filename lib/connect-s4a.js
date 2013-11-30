var request = require('request');
var url = require('url');

module.exports = function (token, options) {

    if (!token) throw new Error('token must be set');

    var options = options || {},
        baseUrl = (options.apiEndPoint || 'http://api.seo4ajax.com/') + token,
        s4aRequest = request.defaults({
            followRedirect: false
        });

    return function (req, res, next) {
        var parsedUrl, xForwardedFor, requestStream;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }
        parsedUrl = url.parse(req.url, true);
        if (parsedUrl.query && (parsedUrl.query['_escaped_fragment_'] || parsedUrl.query['_escaped_fragment_'] === "")) {
            xForwardedFor = req.headers['x-forwarded-for'];
            if (xForwardedFor) {
                xForwardedFor = req.connection.remoteAddress + ', ' + xForwardedFor;
            } else {
                xForwardedFor = req.connection.remoteAddress;
            }
            req.headers['x-forwarded-for'] = xForwardedFor;
            req.pipe(s4aRequest.get(baseUrl + parsedUrl.path)).pipe(res);
        } else {
            next();
        }

    }
}