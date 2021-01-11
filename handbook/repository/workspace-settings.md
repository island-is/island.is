# Workspace Settings

Various project settings can be controlled from the `workspace.json`
file, located in the root of the repository.

## E2E Testing configuration

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
    "args": "--targetName=skilavottord-web --targetHost=localhost:4200",
    "commands":[
      "yarn start {args.targetName} &",
      "./scripts/ci/_wait-for.sh {args.targetHost} --timeout=0 -- curl -s http://{args.targetHost} > /dev/null",
      "yarn run e2e {args.targetName}-e2e --headless --production --record --group={args.targetName}-e2e --base-url http://{args.targetHost} --devServerTarget ''"
    ],
    "parallel": false
  }
},
```

Then we need to update only the `targetName` and `targetHost`
variables in the `args` property for each project:

- `targetName`: The name of the web app that this `e2e` app is
  testing. Usually this is the same name as the `e2e` app name
  with the `-e2e` postfix stripped.
- `targetHost`: The host and port configuration which the target
  app listens on.

> This is executed as part of our GitHub CI pipeline via the `40_e2e.sh`  
> For example to run for `web-e2e`:
>
> ```shell
> ./scripts/ci/40_e2e.sh web-e2e
> ```
