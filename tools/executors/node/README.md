## Custom node:build executor

Runs `@nrwl/node:webpack` in local development and `@anatine/esbuildnx:build` for production builds. This approach is necessary as `esbuildnx` is used for production builds, but its watch logic is currently unreliable.

### Development

To develop and build `impl.js`, run the following command:

```bash
yarn tsc -p tools/executors/node/tsconfig.json --watch
```