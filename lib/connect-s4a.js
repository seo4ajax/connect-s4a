var request = require('request');
var url = require('url');

module.exports = function (token, options) {

    if (!token) throw new Error('token must be set');

    var baseUrl = (options && options.apiEndPoint ? options.apiEndPoint : 'http://api.seo4ajax.com/') + token,
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
            req.pipe(s4aRequest.get(baseUrl + parsedUrl.path))
                .on('error', next)
                .pipe(res)
                .on('error', next);
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }
        parsedUrl = url.parse(req.url, true);
        if (parsedUrl.query && (parsedUrl.query['_escaped_fragment_'] != null))
            return serveCapture();
        if (parsedUrl.path && parsedUrl.path.match(/.*(\.[^?]{2,4}$|\.[^?]{2,4}?.*)/))
            return next();
        if (req.headers['user-agent'] && req.headers['user-agent'].match(/(bot|spider|pinterest|crawler|archiver|flipboard|mediapartners|facebookexternalhit|quora|whatsapp|outbrain|yahoo! slurp|embedly|developers.google.com\/+\/web\/snippet|vkshare|w3c_validator|tumblr|skypeuripreview|nuzzel|qwantify|bitrix link preview|XING-contenttabreceiver|Chrome-Lighthouse|mail\.ru|mediapartners|facebookexternalhit)/gi))
            return serveCapture();
        return next();
    };
};
