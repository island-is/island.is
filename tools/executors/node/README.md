# Custom node:build executor

Runs @nrwl/node:webpack in local dev and @anatine/esbuildnx:build for production builds.

We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.

## Development

To develop and build impl.js, you can run this command:

```
yarn tsc -p tools/executors/node/tsconfig.json --watch
```
