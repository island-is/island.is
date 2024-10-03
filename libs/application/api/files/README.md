```markdown
# Application API Files

This library manages file operations within the Application system API.

## Environment Variables

The following environment variables are expected for the module to operate correctly:

### Application System Files

- `APPLICATION_ATTACHMENT_BUCKET`: Has a fallback for local environments.
- `FILE_SERVICE_PRESIGN_BUCKET`: Has a fallback for local environments.
- `REDIS_URL_NODE_01`: Has a fallback for local environments.

### Signing

- `DOKOBIT_URL`: Has a fallback for local environments.
- `DOKOBIT_ACCESS_TOKEN`: Must be set for local development.

### File Upload Module

- `FILE_STORAGE_UPLOAD_BUCKET`: Has a fallback for local environments.

## Usage

To communicate with the S3 bucket, ensure you have an active AWS session connected to the development cluster.

## Importing into Your Module

#### app.module.ts

```typescript
import { ConfigModule } from '@island.is/nest/config';
import { ApplicationFilesModule } from '@island.is/application/api/files';
import { signingModuleConfig } from '@island.is/dokobit-signing';
import { ApplicationFilesConfig } from '@island.is/application/api/files';
import { FileStorageConfig } from '@island.is/file-storage';

@Module({
  imports: [
    ApplicationFilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        signingModuleConfig,
        FileStorageConfig,
        ApplicationFilesConfig,
      ],
    }),
  ],
})
```

## Running Unit Tests

Execute the unit tests with `nx test application-api-files` using [Jest](https://jestjs.io).
```