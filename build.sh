#!/bin/bash

# clean
rm -rf assets/ tmp/

mkdir assets;
gulp build-css build-assets;
cp -r tmp/themes/default/assets/* assets/;
cat tmp/components/*.css > assets/semantic.css;

# after build
rm -rf tmp/