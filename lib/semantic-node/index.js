const semantic = {
  logger: require('./logger'),
  ThemeBuilder: require('./theme-builder'),
  fs: require('./fs'),
  helper: require('./semantic-cli-helper')
};

semantic.logger.addListener({
  error: function (msg) {
    console.error(msg);
  }
});

module.exports = semantic;

