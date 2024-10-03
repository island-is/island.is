````markdown
# Application UI Fields

This library includes reusable React components for fields in the application system.

## How to Build a New Field

Each field must have a unique `type` which needs to be part of the `FieldTypes` enum inside `application/core/src/types/Fields.ts`. Build a new interface that extends either `Question` or `BaseField`, and finally, add it to the `Field` type in `application-core`.

## Running Unit Tests

Run `nx test application-ui-fields` to execute the unit tests using [Jest](https://jestjs.io).

---

## FileUploadFormField

The file upload form field provides a versatile method to upload files for your application.

### To Use the FileUploadFormField in an Application

1. Add it to the schema using the following structure:

```typescript
const File = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string(),
})

const ExampleSchema = z.object({
  fileUpload: z.array(File),
  // other fields
})
```
````

Optionally, you can set it to be required:

```typescript
const ExampleSchema = z.object({
  fileUpload: z.array(File).nonempty(),
  // other fields
})
```

2. Add the field to the form using the same key as in the schema:

```typescript
buildSection({
  id: 'someSection',
  title: m.someSection,
  children: [
    buildFileUploadField({
      id: 'fileUpload', // This should match the key in the schema
      title: 'Upload files',
      introduction: '',
      uploadDescription: 'Documents must be: .pdf or .docx.',
      // other properties
    }),
    // other children
  ],
})
```

#### Using with AWS S3 (Locally)

(TEMP: this step will continue to be refined as we build out the upload service)

1. Create a test bucket for your account named `testing-islandis`. This will eventually become configurable when we update `file-storage-service.ts`.
2. Install the AWS CLI on your machine.
3. Configure [AWS Secrets](../../../handbook/repository/aws-secrets.md).
4. Run your application locally and attempt to upload a file. You should get a 204 response if successful.

#### Using the FileUploadController in Other Fields

Sometimes you might want to use the `FileUploadController` separately from the field, for example, on a review screen. You can import it from `shared`:

```typescript
import { FileUploadController } from '@island.is/shared/form-fields'

// Usage
;<FileUploadController
  id={id}
  application={application}
  error={error}
  header="Drag documents here to upload"
  description="Please upload your PDF documents"
  buttonLabel="Select documents to upload"
  // other properties
/>
```

#### Reading Out the File Upload Answer

You might want to read out the stored answer of the file upload field. You can use `getValueViaPath` and then `map` through it in your JSX:

```typescript
import { getValueViaPath } from '@island.is/application/core'

// Usage
const uploads = getValueViaPath(application.answers, 'fileUpload') as string[]

;<Box marginY={4}>
  {uploads.map((upload, index) => (
    <Text key={index}>{upload.name}</Text>
  ))}
</Box>
```

#### TODO: Remaining Development Tasks for the FileUploadFormField

1. Disable the Continue button while uploads are occurring, so that the upload promise does not complete when the component is unmounted (i.e., when the user moves on to the next question).
2. Make the bucket name configurable in `file-storage-service.ts`.
3. Localize the error strings in `FileUploadController`.

```

```
