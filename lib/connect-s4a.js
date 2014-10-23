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
		
		function serveCapture() {
			xForwardedFor = req.headers['x-forwarded-for'];
            if (xForwardedFor) {
                xForwardedFor = req.connection.remoteAddress + ', ' + xForwardedFor;
            } else {
                xForwardedFor = req.connection.remoteAddress;
            }
            req.headers['x-forwarded-for'] = xForwardedFor;
            req.pipe(s4aRequest.get(baseUrl + parsedUrl.path)).pipe(res);
		}
		
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }
        parsedUrl = url.parse(req.url, true);
        if (parsedUrl.query && (parsedUrl.query['_escaped_fragment_'] != null)) 
			return serveCapture();
		if (req.headers['user-agent'] && req.headers['user-agent'].match(/(google.*bot|bing|msnbot|yandexbot|pinterest.*ios|mail\.ru)/gi))
			return next();
		if (parsedUrl.path && parsedUrl.path.match(/.*(\.[^?]{2,4}$|\.[^?]{2,4}?.*)/))
			return next();
		if (req.headers['user-agent'] && req.headers['user-agent'].match(/(bot|crawler|spider|archiver|pinterest|facebookexternalhit|flipboardproxy)/gi))
			return serveCapture();
		return next();
    }
}
