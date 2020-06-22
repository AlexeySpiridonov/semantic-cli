let mkdirp;
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
module.exports = ensureDirectory;
