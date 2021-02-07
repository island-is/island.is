# Workspace Settings

Various project settings can be controlled from the `workspace.json`
file, located in the root of the repository.

## E2E Testing configuration

The default Nx setup for E2E tests is experiencing timeouts during some of our tests. This is due to long build and compile time of `NextJS` apps.
In effort to optimize this process we have created an `e2e-ci.js` script
in the `scripts/` directory. It starts by creating a production build
of the app under testing, before starting the Cypress tests. Following
is a documentation of the configuration needed to enable the `e2e-ci` task.

### Pre-requisites

#### NextJS Apps

##### Setting API_MOCKS

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

#### React Apps

##### devServerTarget

For React apps our `e2e-ci.js` script uses the `static-serve.js`
script to serve the production built app. We need to set the
`devServerTarget` for the `production` config of the `e2e` task
for the corresponding `e2e` project.

```json
"e2e": {
  ...
  "configurations": {
    "production": {
      "devServerTarget": ""
    }
  }
},
```

##### Setting API_MOCKS

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

  return config
}
```

### Add `e2e-ci` task

Finally we need to add a `e2e-ci` task to the `architect` property
of the corrensponding `e2e` project.

#### NextJS

```json
"e2e-ci": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "command": "yarn e2e-ci -n web-e2e"
  }
},
```

#### React

```json
"e2e-ci": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "command": "yarn e2e-ci -n service-portal-e2e -t react -f dist/apps/service-portal -b /minarsidur"
  }
},
```

#### Configure

The `e2e-ci.js` script requires few parameters:

- `-n` - The name of the e2e project. The script uses this name to find
  the name of the target app (by stripping of the `-e2e` ending).
- `-t` - Only for React. Sets the app type to `react`.
- `-f` - Only for React. Sets the output directory for the production build.
- `-b` - Optional for React. If the app is deployed to a sub-directory,
  that is the `base` in `index.html` this option is needed to
  set that path.

Further details can be found be using the `-h` parameter for the script:

```
node scripts/e2e-ci.js -h
```

### E2E test locally

To test e2e locally it can either be done like before using the `e2e`task

```bash
yarn e2e web-e2e
```

or using the `e2e-ci` task

```bash
yarn nx run web-e2e:e2e-ci
```

### E2E in CI

This task is executed as part of our GitHub CI pipeline via the `40_e2e.sh`.
This script adds the `-c` option to enable Cypress recording.
