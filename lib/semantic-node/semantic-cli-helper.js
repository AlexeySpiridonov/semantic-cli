// semantic-cli_helper.js
//
//      helper functions for semantic-cli
let semantic_cli_helper = {

  //Stylize a string
  stylize: function (str, style) {
    const styles = {
      'reset': [0, 0],
      'bold': [1, 22],
      'inverse': [7, 27],
      'underline': [4, 24],
      'yellow': [33, 39],
      'green': [32, 39],
      'red': [31, 39],
      'grey': [90, 39]
    };
    return '\x1b[' + styles[style][0] + 'm' + str +
      '\x1b[' + styles[style][1] + 'm';
  },

  //Print command line options
  printUsage: function () {
    console.log('usage: semantic-cli [option option=parameter ...] [destination]');
    console.log('');
    console.log('If source is set to `-\' (dash or hyphen-minus), input is read from stdin.');
    console.log('');
    console.log('options:');
    console.log('  -h, --help                         Prints help (this message) and exit.');
    console.log('  --include-components=COMPONENTS    Sets include paths. Separated by `:\'. `;\' also supported on windows.');
    console.log(' ');
    console.log('  --global-var=\'VAR=VALUE\'         Defines a variable that can be referenced by the file.');
    console.log('  --modify-var=\'VAR=VALUE\'         Modifies a variable already declared in the file.');
    console.log('  --plugin=PLUGIN=OPTIONS            Loads a plugin. You can also omit the --plugin= if the plugin begins');
    console.log('                                     less-plugin. E.g. the clean css plugin is called less-plugin-clean-css');
    console.log('                                     once installed (npm install less-plugin-clean-css), use either with');
    console.log('                                     --plugin=less-plugin-clean-css or just --clean-css');
    console.log('                                     specify options afterwards e.g. --plugin=less-plugin-clean-css="advanced"');
    console.log('                                     or --clean-css="advanced"');
  }
};

// Exports helper functions
for (let h in semantic_cli_helper) {
  if (semantic_cli_helper.hasOwnProperty(h)) {
    exports[h] = semantic_cli_helper[h];
  }
}
