# Application API Files

This library handles file management for the Application system api.

## Environment variables

For this module to run the following variables are set.

### Application system files:

`APPLICATION_ATTACHMENT_BUCKET` has a fallback locally \
`FILE_SERVICE_PRESIGN_BUCKET` has a fallback locally \
`REDIS_URL_NODE_01` has a fallback locally

### Signing:

`DOKOBIT_URL` has a fallback locally \
`DOKOBIT_ACCESS_TOKEN` needs to be set for local development

### File upload module:

`FILE_STORAGE_UPLOAD_BUCKET` has a fallback locally

## Usage

For s3 bucket communication you need to have an active AWS session to the development cluster

## Import into your module

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config'
import { ApplicationFilesModule } from '@island.is/application/api/files'
import { signingModuleConfig } from '@island.is/dokobit-signing',
import { ApplicationFilesConfig } from '@island.is/application/api/files'
import { FileStorageConfig } from '@island.is/file-storage'

@Module({
  imports: [
      ApplicationFilesModule,
      ConfigModule.forRoot({
        isGlobal:true,
        load:[
        signingModuleConfig,
        FileStorageConfig,
        ApplicationFilesConfig
        ]
      })
    ],
})
```

## Running unit tests

Run `nx test application-api-files` to execute the unit tests via [Jest](https://jestjs.io).
