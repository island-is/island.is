# Workspace Settings

Various project settings can be controlled from the `workspace.json`
file, located in the root of the repository.

## E2E Testing configuration for timeouts

We are experiencing timeouts during some of our `Cypress` end-to-end
tests. This is due to long build and compile time of `NextJS` apps.
So we have a seperate `e2e-ci` task setup in the `workspace.json`
configuration of each `e2e` app. With this configuration we can let
`Cypress` wait until the server is ready before starting it's test
execution.

### NextJS apps pre-requisites

#### Setting API_MOCKS

We need to make sure that the `API_MOCKS` environment variable is set in
the `next.config.js`

```javascript
// ...
serverRuntimeConfig: {
  // ...
},
publicRuntimeConfig: {
  // ...
},
env: {
  API_MOCKS: process.env.API_MOCKS,
},
```

### React apps pre-requisites

For React apps we first need to add a task `static-serve`
in the target web app. For example for the `service-portal-e2e`
it is `service-portal`

```json
"static-serve": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "commands": [
      {
        "command": "yarn serve -l 4200 -s dist/apps/service-portal",
        "forwardAllArgs": false
      }
    ],
    "readyWhen": "Accepting connections"
  }
},
```

Here you need to change the path that follows the `-s`
parameter for the corresponding `dist` folder of your
built app.

_Additionally_ you can change the `port` parameter by
changing the value that comes after `-l` option.

Next we change the `devServerTarget` for the `production` config of
the `e2e` task in the `e2e` project to use this new `static-serve` task.

```json
"e2e": {
  ...
  "configurations": {
    "production": {
      "devServerTarget": "service-portal:static-serve"
    }
  }
},
```

#### Setting API_MOCKS

For React apps we have a common webpack config in `libs/share/webpack`
which we use to make sure the `API_MOCKS` environment variable is set,
along with other common plugins and settings.

Your `webpack.config.js` should look like this:

```javascript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')

module.exports = (config, context) => {
  // Add our common webpack config
  nrwlConfig(config)

  // Here you can add app specific config

  return {
    ...config,
    node: {
      process: true,
      global: true,
    },
  }
}
```

### Add `e2e-ci` task

Finally we need to add a `e2e-ci` task to the `architect` property
of the corrensponding `e2e` project.

```json
"e2e-ci": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "args": "--targetName=web",
    "commands": [
      "yarn nx run {args.targetName}:build:production",
      "yarn nx run {args.targetName}-e2e:e2e:production --headless --production --base-url http://localhost:4200 --record --group={args.targetName}-e2e"
    ],
    "parallel": false
  }
},
```

And configure the `targetName` in the `args` property for each project:

- `targetName`: The name of the web app that this `e2e` app is
  testing. Usually this is the same name as the `e2e` app name
  with the `-e2e` postfix stripped.

Additionally we can change the `base-url` parameter if the apps starts on another `host:port`.

### E2E in CI

This task is executed as part of our GitHub CI pipeline via the `40_e2e.sh`  
For example to run for `web-e2e`:

```shell
./scripts/ci/40_e2e.sh web-e2e
```

### E2E test locally

As before we use the `e2e` task to test locally

```shell
yarn e2e web-e2e
```

> **Note** Currently the `e2e-ci` task only works in the CI environment
> as we are using `--record` and `--group` parameters for Cypress.  
> To test the task locally you can temporarily remove those parameters
> in `workspace.json` for the corresponding `e2e-ci` task you want to test.
