#!/usr/bin/env node

const path = require('path');
let errno;

try {
  errno = require('errno');
} catch (err) {
  errno = null;
}

const args = process.argv.slice(1);
const semanticCli = require('../lib/semantic-node');

// This code will still be required because otherwise rejected promises would not be reported to the user
process.on('unhandledRejection', function (err) {
  semanticCli.logger.error(err);
  process.exitCode = 1;
});


// self executing function so we can return
(function () {
  const filename = 'semantic.less';
  const paths = [path.dirname(path.join(__dirname, `../src/${filename}`))];

  // путь к файлу который будет результатом сборки
  let output = args[1];
  const outputBase = args[1];
  if (output) {
    output = path.resolve(process.cwd(), output);
  }

  if (!outputBase) {
    semanticCli.logger.error('semantic-cli: an output path requires to be specified');
    process.exitCode = 1;
    return;
  }

  const builder = new semanticCli.ThemeBuilder({filename, paths, output});
  builder.buildTheme();

})();
