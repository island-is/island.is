# Adding the Field to a Form

To use the FileUploadFormField in an application


## 1. Add it to the *schema* using the following structure:
   
```
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
```
const ExampleSchema = z.object({
  fileUpload: z.array(File).nonempty(),
  ...
}
```

## 2. Add the field to the *form* using the same key as in the schema:

```
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

---
## Using with AWS S3 (locally)
(TEMP: this step will continue to be refined as we build out the upload service)

1. Create a test bucket for your account named `testing-islandis`. *This will eventually become configurable when we update `file-storage-service.ts`*
2. Install the aws-cli on your machine
3. Run `aws configure` in the command line and enter your `ACCESS_KEY_ID` and then when prompted, enter your `SECRET_ACCESS_KEY`. Then confirm that the region is `eu-west-1`. Once those are set, the node app extracts the aws config and uses it, so no .env variables needed.
4. Run you application locally and attempt to upload a file, you should get a 204 response if successful.

---

## Using the FileUploadController in other fields
Sometimes you might want to use the FileUploadController separately from the field (in a custom field), for example a Review screen.
You can do so by importing it from `shared`

```
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
---
## Reading out the file upload answer
Sometimes you might want to read out the stored answer of the file upload field. You can do so with `getValueViaPath` and then `map` through it in your jsx.
```
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

## TODO: Remaining dev tasks
1. Make it so that the Continue button is disabled while uploads are occuring, so that the upload promise does not complete when the component has unmounted (aka the user moved on to the next question).
2. Make the bucket name configurable in `file-storage-service.ts`
3. Localise the error strings in `FileUploadController`