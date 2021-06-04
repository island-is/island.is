# NextJS Custom Server

We use a custom NextJS server to standardise logging, tracing and metrics in production.

## How it works

In development, we use `@nrwl/node:execute` to build and run a project-specific `server.ts` module. This file imports shared code that configures our environments, and starts an express server. It then configures NextJS as an express middleware that builds and serves pages directly from the source folder.

In production, we run two build commands targeting the same `dist` folder: A NextJS build (using `@nrwl/next:build`) and a `server.ts` build (using `@nrwl/node:build`). When we run the compiled `server.ts` module, it runs the same code, but this time using the compiled NextJS app.

{% hint style="warning" %}
This logic depends on `process.env.NODE_ENV === 'production'`. When it is true, `server.ts` loads a production nextjs build in `cwd`. When it is false, `server.ts` runs NextJS in development mode, and tries to serve pages from the source directory.
{% endhint %}

## Setup in new project

Follow these steps to configure our custom NextJS server in your NextJS project:

1. Add a `server.ts` file to the root folder of your NextJS project with the following content. Be sure to replace the `{{variables}}` with correct values. See `apps/web/server.ts` for example setup.

```typescript
import { bootstrap } from '@island.is/infra-next-server'

bootstrap({
  name: '{{projectName}}',
  appDir: 'apps/{{pathToAppDir}}',
})
```

2. Open `workspace.json`, find your project definition and replace the "build" and "serve" architect keys with the following content. Be sure to replace the `{{variables}}` with correct values, and edit `build` configurations as needed.

```json
"build": {
  "builder": "@nrwl/workspace:run-commands",
  "options": {
    "outputPath": "dist/apps/{{pathToAppDir}}",
    "commands": [
      "yarn nx run {{projectName}}:build-next:production",
      "yarn nx run {{projectName}}:build-server:production"
    ]
  }
},
"build-next": {
  "builder": "@nrwl/next:build",
  "options": {
    "root": "apps/{{pathToAppDir}}",
    "outputPath": "dist/apps/{{pathToAppDir}}"
  },
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "apps/{{pathToAppDir}}/environments/environment.ts",
          "with": "apps/{{pathToAppDir}}/environments/environment.prod.ts"
        }
      ]
    }
  }
},
"build-server": {
  "builder": "@nrwl/node:build",
  "options": {
    "outputPath": "dist/apps/{{pathToAppDir}}",
    "main": "apps/{{pathToAppDir}}/server.ts",
    "tsConfig": "apps/{{pathToAppDir}}/tsconfig.json",
    "maxWorkers": 2
  },
  "configurations": {
    "production": {
      "optimization": true,
      "extractLicenses": true,
      "inspect": false
    }
  }
},
"serve": {
  "builder": "@nrwl/node:execute",
  "options": {
    "buildTarget": "{{projectName}}:build-server"
  }
},
```

3. Also, in `workspace.json`, find your "{{projectName}}-e2e" definition and add a `baseUrl` to the `e2e` target so Cypress can find your server:

```json
"e2e": {
  "builder": "@nrwl/cypress:cypress",
  "options": {
    "cypressConfig": "apps/{{pathToAppDir}}-e2e/cypress.json",
    "tsConfig": "apps/{{pathToAppDir}}-e2e/tsconfig.e2e.json",
    "baseUrl": "http://localhost:4200",
    "devServerTarget": "{{projectName}}:serve"
  },
  "configurations": {
    "production": {
      "devServerTarget": "{{projectName}}:serve:production"
    }
  }
},
```
