# Application API Files

This library manages file operations for the Application system API.

## Environment Variables

Ensure the following environment variables are set:

### Application System Files

- `APPLICATION_ATTACHMENT_BUCKET` (fallback available locally)
- `FILE_SERVICE_PRESIGN_BUCKET` (fallback available locally)
- `REDIS_URL_NODE_01` (fallback available locally)

### Signing

- `DOKOBIT_URL` (fallback available locally)
- `DOKOBIT_ACCESS_TOKEN` (must be set for local development)

### File Upload Module

- `FILE_STORAGE_UPLOAD_BUCKET` (fallback available locally)

## Usage

For S3 bucket communication, an active AWS session to the development cluster is required.

## Import into Your Module

Update `app.module.ts` as follows:

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
export class AppModule {}
```

## Running Unit Tests

Execute `nx test application-api-files` to run the unit tests using [Jest](https://jestjs.io).