## Custom Node Build Executor

This utility handles the build process using `@nrwl/node:webpack` for local development and `@anatine/esbuildnx:build` for production builds. This dual approach is necessary because `esbuildnx` lacks an efficient watch feature for a satisfactory developer experience.

## Development

To develop and continuously build `impl.js`, run:

```
yarn tsc -p tools/executors/node/tsconfig.json --watch
```
