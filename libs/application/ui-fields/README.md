# Application UI Fields

This library includes reusable react components for fields in the application system.

## How to build a new Field

Each Field has to have its own unique `type` which needs to be part of the `FieldTypes` enum inside `application/core/src/types/Fields.ts`. Then build a new interface that extends `Question` or `BaseField`, add finally add that to the `Field` type in `application-core`.

## Running unit tests

Run `nx test application-ui-fields` to execute the unit tests via [Jest](https://jestjs.io).

---

## FileUploadFormField

The file upload form field provides a general way to upload files for your application.

### To use the FileUploadFormField in an application

1. Add it to the _schema_ using the following structure:

```typescript
const File = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string(),
})

const ExampleSchema = z.object({
  fileUpload: z.array(File),
  ...
}
```

Optionally you can set it to be required:

```typescript
const ExampleSchema = z.object({
  fileUpload: z.array(File).nonempty(),
  ...
}
```

2. Add the field to the _form_ using the same key as in the schema:

```typescript
 buildSection({
    id: 'someSection',
    title: m.someSection,
    children: [
        buildFileUploadField({
          id: 'fileUpload', // This Should match the key in the schema
          title: 'Upload files',
          introduction: '',
          uploadDescription: 'Documents must be: .pdf or .docx.',
          ...
        }),
        ...
    ]
 })
```

#### Using with AWS S3 (locally)

(TEMP: this step will continue to be refined as we build out the upload service)

1. Create a test bucket for your account named `testing-islandis`. _This will eventually become configurable when we update `file-storage-service.ts`_
2. Install the aws-cli on your machine
3. Configure [AWS Secrets](../../../handbook/repository/aws-secrets.md)
4. Run you application locally and attempt to upload a file, you should get a 204 response if successful.

#### Using the FileUploadController in other fields

Sometimes you might want to use the FileUploadController separately from the field (in a custom field), for example a Review screen.
You can do so by importing it from `shared`

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

#### Reading out the file upload answer

Sometimes you might want to read out the stored answer of the file upload field. You can do so with `getValueViaPath` and then `map` through it in your jsx.

```typescript
import { getValueViaPath } from '@island.is/application/core'

...

const uploads = getValueViaPath(application.answers, 'fileUpload') as string[]

...

<Box marginY={4}>
  {uploads.map((upload, index) => (
    <Text key={index}>{upload.name}</Text>
  ))}
</Box>

```

#### TODO: Remaining dev tasks for the FileUploadFormField

1. Make it so that the Continue button is disabled while uploads are occuring, so that the upload promise does not complete when the component has unmounted (aka the user moved on to the next question).
2. Make the bucket name configurable in `file-storage-service.ts`
3. Localise the error strings in `FileUploadController`
