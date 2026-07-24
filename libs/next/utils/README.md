# next/utils

Utilities specific to Next.js (pages router) apps.

## Runtime environment

Preserves the build-once/deploy-everywhere model: server code reads
`process.env` at request time, `<RuntimeEnv env={...} />` in
`pages/_document.tsx` serializes the public values into a JSON script tag, and
`getClientRuntimeEnv()` reads them back in the browser. See each app's
`environments/runtimeEnvironment.ts` for the pattern.

Never put secrets in the env object passed to `<RuntimeEnv />` — it is
serialized into every HTML response.

## Running unit tests

Run `nx test next-utils` to execute the unit tests via [Jest](https://jestjs.io).
