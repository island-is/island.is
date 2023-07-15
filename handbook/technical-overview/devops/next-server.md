# NextJS Custom Server

We use a custom NextJS server to standardise logging, tracing and metrics in production. This uses NX's official support for [custom servers in NextJS](https://nx.dev/packages/next/generators/custom-server).

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

2. Then create a new tsconfig file called `tsconfig.server.json` with the following contents. Be sure to replace the `{{variables}}` with correct values.

```
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "noEmit": false,
    "incremental": true,
    "tsBuildInfoFile": "../../{{extraRelativePathToRoot}}tmp/buildcache/apps/{{pathToAppDir}}/server",
    "types": [
      "node"
    ]
  },
  "include": ["server.ts"]
}
```

3. Finally, open the `project.json` file in your project folder and replace the "build" and "serve" target keys with the following content. Remember to replace the `{{variables}}` with correct values, and edit the `build` configurations as needed.

```json
"build": {
  "executor": "@nx/next:build",
  "outputs": ["{options.outputPath}"],
  "defaultConfiguration": "production",
  "options": {
    "outputPath": "dist/apps/{{pathToAppDir}}"
  },
  "configurations": {
    "development": {
      "outputPath": "apps/{{pathToAppDir}}"
    },
    "production": {}
  },
  "dependsOn": [
    "build-custom-server"
  ]
},
"build-custom-server": {
  "executor": "@nx/webpack:webpack",
  "defaultConfiguration": "production",
  "options": {
    "outputPath": "dist/apps/{{pathToAppDir}}",
    "main": "apps/{{pathToAppDir}}/server.ts",
    "tsConfig": "apps/{{pathToAppDir}}/tsconfig.server.json",
    "maxWorkers": 2,
    "assets": [],
    "compiler": "tsc",
    "target": "node"
  },
  "configurations": {
    "development": {},
    "production": {
      "optimization": true,
      "extractLicenses": true,
      "inspect": false
    }
  }
},
"serve": {
  "executor": "@nx/next:server",
  "defaultConfiguration": "development",
  "options": {
    "buildTarget": "{{projectName}}:build",
    "dev": true,
    "customServerTarget": "{{projectName}}:serve-custom-server"
  },
  "configurations": {
    "development": {
      "buildTarget": "{{projectName}}:build:development",
      "dev": true,
      "customServerTarget": "{{projectName}}:serve-custom-server:development"
    },
    "production": {
      "buildTarget": "{{projectName}}:build:production",
      "dev": false,
      "customServerTarget": "{{projectName}}:serve-custom-server:production"
    }
  }
},
"serve-custom-server": {
  "executor": "@nx/js:node",
  "defaultConfiguration": "development",
  "options": {
    "buildTarget": "{{projectName}}:build-custom-server"
  },
  "configurations": {
    "development": {
      "buildTarget": "{{projectName}}:build-custom-server:development"
    },
    "production": {
      "buildTarget": "{{projectName}}:build-custom-server:production"
    }
  }
},
```
