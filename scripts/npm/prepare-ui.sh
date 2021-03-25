#!/bin/bash

DIST_ROOT="dist"
LIB_UI_ROOT="libs/island-ui"
UI="ui"
DIST_UI="$DIST_ROOT/$UI"

# We want to use NX publishable builder, however Treat is making things hard.
# Simply copy/pasting the UI library for the first alpha version.
# Most likely use semantic-release to handle npm releases https://github.com/semantic-release/semantic-release

if [[ ! -d "$DIST_UI" ]]; then
  mkdir -p "$DIST_UI"
fi

# Find something better than this in the future.
perl -pi -e "s/interface SelectorMap {/export interface SelectorMap {/" "node_modules/treat/lib/types/types.d.ts"

cp -R "$LIB_UI_ROOT/core/" "$DIST_UI"

rm "$DIST_UI/.babelrc"
rm "$DIST_UI/.eslintrc"
rm "$DIST_UI/jest.config.js"
rm "$DIST_UI/jest.setup.ts"
rm "$DIST_UI/tsconfig.json"
rm "$DIST_UI/tsconfig.lib.json"
rm "$DIST_UI/tsconfig.spec.json"

find $DIST_UI -type f \(\
  -name "*.stories.tsx" \
  -o -name "*.stories.mdx" \
\) -delete

tsc --project "$DIST_UI/tsconfig.npm.json"

# To publish to npm
# cd dist/ui
# npm publish
