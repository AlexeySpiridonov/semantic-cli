let fs;
try {
  fs = require('graceful-fs');
} catch (err) {
  fs = require('fs');
}
module.exports = fs;
