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

To enable this we need to add this `e2e-ci` task to the `architect`
property of the `e2e` project.

```json
"e2e-ci": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "args": "--targetName=web --targetHost=http://localhost:4200",
    "command": "yarn start-test 'yarn start {args.targetName}' {args.targetHost} \"yarn run e2e  {args.targetName}-e2e --headless --production --base-url {args.targetHost} --devServerTarget ''\""
  }
},
```

Then we need to set the `targetName` and `targetHost`
in the `args` property for each project:

- `targetName`: The name of the web app that this `e2e` app is
  testing. Usually this is the same name as the `e2e` app name
  with the `-e2e` postfix stripped.
- `targetHost`: The host and port configuration which the target
  app listens on.

>

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
