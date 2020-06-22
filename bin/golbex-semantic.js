#!/usr/bin/env node

const args = process.argv.slice(1);
const path = require('path');
let errno;

try {
  errno = require('errno');
} catch (err) {
  errno = null;
}

// This code will still be required because otherwise rejected promises would not be reported to the user
process.on('unhandledRejection', function (err) {
  console.error(err);
  process.exitCode = 1;
});

const SemanticUiBuilder = require('../lib/builder');

// self executing function so we can return
(function () {
  const builder = new SemanticUiBuilder();
  const filename = 'semantic.less';
  const paths = [path.dirname(path.join(__dirname, `../src/${filename}`))];

  // входной файл
  let input = path.join(__dirname, `../src/${filename}`);
  if (input) {
    input = path.resolve(process.cwd(), input);
  }
  // путь к файлу который будет результатом сборки
  let outputPath = args[1];
  const outputBase = args[1];
  if (outputPath) {
    outputPath = path.resolve(process.cwd(), outputPath);
  }

  console.log(outputPath, outputBase);

  if (!outputBase) {
    console.error('golbex-semantic: an output path requires to be specified');
    process.exitCode = 1;
    return;
  }



  // прекомпиляция темы semantic'а
  const render = function (err, data) {
    if (err) {
      console.error('golbex-semantic: ' + err.message);
      process.exitCode = 1;
      return;
    }

    data = data.replace(/^\uFEFF/, '');


    console.log(paths);
    less.logger.addListener({
      error: function (msg) {
        console.error(msg);
      }
    });

    const options = {filename, paths};
    less.render(data, options)
      .then(
        // пишем в файл
        (renderResult) => writeOutput(outputPath, renderResult, () => {
          console.log('success');
        }),
        (err) => {
          less.writeError(err, options);
          process.exitCode = 1;
        }
      );
  };

  less.fs.readFile(input, 'utf8', render);
})();
