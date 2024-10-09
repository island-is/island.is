# Application UI Fields

This library includes reusable React components for application system fields.

## Building a New Field

1. Define a unique `type` in `FieldTypes` enum in `application/core/src/types/Fields.ts`.
2. Create an interface extending `Question` or `BaseField`.
3. Include it in the `Field` type in `application-core`.

## Running Unit Tests

Execute `nx test application-ui-fields` to run unit tests using [Jest](https://jestjs.io).

---

## FileUploadFormField

The file upload form field supports file uploads in your application.

### Use in Application

1. **Add to Schema:**

   ```typescript
   const File = z.object({
     name: z.string(),
     key: z.string(),
     url: z.string(),
   })

   const ExampleSchema = z.object({
     fileUpload: z.array(File),
     ...
   })
   ```

   **Make Required:**

   ```typescript
   const ExampleSchema = z.object({
     fileUpload: z.array(File).nonempty(),
     ...
   })
   ```

2. **Add to Form:**

   ```typescript
   buildSection({
     id: 'someSection',
     title: m.someSection,
     children: [
       buildFileUploadField({
         id: 'fileUpload', // Match schema key
         title: 'Upload files',
         introduction: '',
         uploadDescription: 'Documents must be: .pdf or .docx.',
         ...
       }),
       ...
     ]
   })
   ```

#### Using with AWS S3 Locally

1. Create a `testing-islandis` test bucket.
2. Install aws-cli.
3. Configure [AWS Secrets](https://docs.devland.is/development/aws-secrets).
4. Run locally and test file upload; a 204 response indicates success.

#### Using FileUploadController Independently

Import from `shared` for standalone use:

```typescript
import { FileUploadController } from '@island.is/shared/form-fields'

...

<FileUploadController
  id={id}
  application={application}
  error={error}
  header='Drag documents here to upload'
  description='Please upload your PDF documents'
  buttonLabel='Select documents to upload'
  ...
/>
```

#### Accessing File Upload Answers

Retrieve uploaded file info with `getValueViaPath`:

```typescript
import { getValueViaPath } from '@island.is/application/core'

...

const uploads = getValueViaPath(application.answers, 'fileUpload') as any[]

...

<Box marginY={4}>
  {uploads.map((upload, index) => (
    <Text key={index}>{upload.name}</Text>
  ))}
</Box>
```

#### TODO: Development Tasks

1. Disable "Continue" button during uploads to ensure promise completion.
2. Make bucket name configurable in `file-storage-service.ts`.
3. Localize error strings in `FileUploadController`.
