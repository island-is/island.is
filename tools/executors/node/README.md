## Custom Node Build Executor

This utility manages the build process using `@nrwl/node:webpack` for local development and `@anatine/esbuildnx:build` for production builds. This dual approach is necessary because `esbuildnx` lacks an efficient watch feature for a satisfactory developer experience.

## Development

To develop and continuously build `impl.js`, run:

```bash
yarn tsc -p tools/executors/node/tsconfig.json --watch
```

