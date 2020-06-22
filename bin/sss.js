#!/usr/bin/env node
const path = require('path');
const args = process.argv.slice(1);

let output = args[1];
const outputBase = args[1];
if (output) {
  output = path.resolve(process.cwd(), output);
}

console.log(output, outputBase);

const filename = 'semantic.less';
const paths = [path.dirname(path.join(__dirname, `../src/${filename}`))];

let input = path.join(__dirname, `../src/${filename}`);
if (input) {
  input = path.resolve(process.cwd(), input);
}

console.log(input, paths);
