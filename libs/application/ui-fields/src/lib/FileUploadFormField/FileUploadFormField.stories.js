import { dedent } from 'ts-dedent'

import { FileUploadFormField } from './FileUploadFormField'

const createMockApplication = (data = {}) => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || 'ExampleForm',
  modified: new Date(),
  created: new Date(),
  attachments: {},
  answers: data.answers || {},
  externalData: data.externalData || {},
})

export default {
  title: 'Application System/FileUploadFormField',
  component: FileUploadFormField,
}

export const Default = {
  render: () => (
    // 10 MB
    <FileUploadFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: '',
        introduction: 'Field introduction',
        maxSize: 10000000,
        uploadAccept: '.pdf',
        uploadHeader: 'Field upload header',
        uploadDescription: 'Field upload description',
        uploadButtonLabel: 'Field upload button label',
      }}
    />
  ),

  name: 'Default',
}
