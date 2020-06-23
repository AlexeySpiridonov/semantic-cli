const fs = require('./fs');
const logger = require('./logger');
const path = require('path');
const lessc = require('less');

const SemanticThemeBuilder = function (options) {
  this.options = options || {};
  this.options.filename = options.filename || 'semantic.less';
  this.options.paths = options.paths || [];
  this.options.output = options.output || '';

  this.entryFile = path.join(__dirname, `../../src/${this.options.filename}`);
  if (this.entryFile) {
    this.entryFile = path.resolve(process.cwd(), this.entryFile);
  }

  this.options.theme = options.theme || '_default';
  this.options.verbose = options.verbose || false;
  this.options.silent = options.silent || true;

  logger.addListener({
    info: function (msg) {
      if (options.verbose) {
        console.log(msg);
      }
    },
    warn: function (msg) {
      // do not show warning if the silent option is used
      if (!options.silent) {
        console.warn(msg);
      }
    }
  });

  this.render = this.render.bind(this);

  return this;
};

SemanticThemeBuilder.prototype.ensureDirectory = function (filepath) {
  const dir = path.dirname(filepath);
  const existsSync = fs.existsSync || path.existsSync;

  if (!existsSync(dir)) {
    let mkdirp;
    try {
      mkdirp = require('mkdirp');
    } catch (e) {
      mkdirp = null;
    }
    const cmd = mkdirp && mkdirp.sync || fs.mkdirSync;
    cmd(dir);
  }
};

SemanticThemeBuilder.prototype.writeOutput = function (filepath, resultCss, onSuccess) {
  // создаем путь до файла
  this.ensureDirectory(filepath);
  // пишем css в файл
  fs.writeFile(
    filepath,
    resultCss,
    {encoding: 'utf8'},
    (err) => {
      if (err) {
        let description = 'Error: ';
        if (errno && errno.errno[err.errno]) {
          description += errno.errno[err.errno].description;
        } else {
          description += err.code + ' ' + err.message;
        }
        logger.error('semantic-cli: failed to create file ' + filepath);
        logger.error(description);
        process.exitCode = 1;
      } else {
        logger.info('semantic-cli: wrote ' + filepath);
        onSuccess();
      }
    });
};

SemanticThemeBuilder.prototype.render = function (err, data) {
  if (err) {
    logger.error('semantic-cli: ' + err.message);
    process.exitCode = 1;
    return;
  }

  data = data.replace(/^\uFEFF/, '');

  let options = {...this.options};
  lessc.render(data, options)
    .then(
      // пишем в файл
      (renderResult) => this.writeOutput(options.output, renderResult, () => {
        logger.info('success');
      }),
      (err) => {
        lessc.writeError(err, options);
        process.exitCode = 1;
      }
    );
};

SemanticThemeBuilder.prototype.buildTheme = function () {
  fs.readFile(this.entryFile, 'utf8', this.render);
};

module.exports = SemanticThemeBuilder;
