#!/usr/bin/env node

const less = require('less');
const path = require('path');
let errno;
let mkdirp;

try {
  errno = require('errno');
} catch (err) {
  errno = null;
}

const args = process.argv.slice(1);

// This code will still be required because otherwise rejected promises would not be reported to the user
process.on('unhandledRejection', function (err) {
  console.error(err);
  process.exitCode = 1;
});

// self executing function so we can return
(function () {

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

  // создает рекурсивно директории по указанному пути
  const ensureDirectory = function (filepath) {
    const dir = path.dirname(filepath);
    const existsSync = less.fs.existsSync || path.existsSync;
    let cmd;
    if (!existsSync(dir)) {
      if (mkdirp === undefined) {
        try {
          mkdirp = require('mkdirp');
        } catch (e) {
          mkdirp = null;
        }
      }
      cmd = mkdirp && mkdirp.sync || less.fs.mkdirSync;
      cmd(dir);
    }
  };

  // создает файл по указанному пути
  const writeOutput = function (filepath, renderResult, onSuccess) {
    // создаем путь до файла
    ensureDirectory(filepath);
    // пишем css в файл
    less.fs.writeFile(
      filepath,
      renderResult.css,
      {encoding: 'utf8'},
      (err) => {
        if (err) {
          let description = 'Error: ';
          if (errno && errno.errno[err.errno]) {
            description += errno.errno[err.errno].description;
          } else {
            description += err.code + ' ' + err.message;
          }
          console.error('golbex-semantic: failed to create file ' + filepath);
          console.error(description);
          process.exitCode = 1;
        } else {
          less.logger.info('golbex-semantic: wrote ' + filepath);
          onSuccess();
        }
      });
  };

  // прекомпиляция темы semantic'а
  const buildSemanticLess = function (err, data) {
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

  less.fs.readFile(input, 'utf8', buildSemanticLess);
})();
