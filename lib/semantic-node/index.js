let SemanticThemeBuilder = function (options) {
  this.options = options || {
    filename: 'semantic.less',
    theme: 'golbex'
  };
  this.ensureDirectory = require('ensureDirectory');
  this.fs = require('./fs');
  this.lessc = require('less');

  return this;
};

SemanticThemeBuilder.prototype.writeOutput = function (filepath, resultCss, onSuccess) {
  // создаем путь до файла
  this.ensureDirectory(filepath);
  // пишем css в файл
  less.fs.writeFile(
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
        console.error('golbex-semantic: failed to create file ' + filepath);
        console.error(description);
        process.exitCode = 1;
      } else {
        less.logger.info('golbex-semantic: wrote ' + filepath);
        onSuccess();
      }
    });
};


module.exports = SemanticThemeBuilder;
