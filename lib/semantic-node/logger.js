const Logger = function () {
  // private
  let _listeners = [];

  const _fireEvent = function (type, ...msg) {
    for (let i = 0; i < msg.length; i++) {
      for (let i1 = 0; i1 < _listeners.length; i1++) {
        const logFunction = _listeners[i][type];
        if (logFunction) {
          logFunction(msg);
        }
      }
    }
  };

  // public
  return {
    error: function (...msg) {
      _fireEvent('error', msg);
    },
    warn: function (...msg) {
      _fireEvent('warn', msg);
    },
    info: function (...msg) {
      _fireEvent('info', msg);
    },
    debug: function (...msg) {
      _fireEvent('debug', msg);
    },
    addListener: function (listener) {
      _listeners.push(listener);
    },
    removeListener: function (listener) {
      for (let i = 0; i < _listeners.length; i++) {
        if (_listeners[i] === listener) {
          _listeners.splice(i, 1);
          return;
        }
      }
    },
  };
};

const logger = new Logger();

module.exports = logger;
