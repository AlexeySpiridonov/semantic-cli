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

module.exports = render;
