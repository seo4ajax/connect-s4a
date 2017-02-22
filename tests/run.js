var reporter = require('nodeunit').reporters.default;
process.chdir(__dirname);
reporter.run(['connect.js', 'express.js']);