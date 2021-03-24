#!/bin/bash

DIST_ROOT="dist"
LIB_UI_ROOT="libs/island-ui"

rm -rf $DIST_ROOT

tsc --project libs/island-ui/core/tsconfig.npm.json

mv "$DIST_ROOT/$LIB_UI_ROOT/core" "$DIST_ROOT/ui"

cp "$LIB_UI_ROOT/core/package.json" "$DIST_ROOT/ui"
cp "$LIB_UI_ROOT/core/README.md" "$DIST_ROOT/ui"

rm -rf "$DIST_ROOT/libs"
rm "$DIST_ROOT/ui/jest.config.d.ts"
rm "$DIST_ROOT/ui/jest.config.js"
rm "$DIST_ROOT/ui/jest.setup.d.ts"
rm "$DIST_ROOT/ui/jest.setup.js"
