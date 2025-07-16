import { dedent } from 'ts-dedent'

import { ImageFormField } from './ImageFormField'

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
  title: 'Application System/ImageFormField',
  component: ImageFormField,
}

export const Default = {
  render: () => (
    <ImageFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        imageWidth: 'full',
        image:
          'https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg',
      }}
      showFieldName
    />
  ),

  name: 'Default',
}

export const AutoWidth = {
  render: () => (
    <ImageFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        imageWidth: 'auto',
        image:
          'https://images.ctfassets.net/8k0h54kbe6bj/019iw5SSHsBi5vnjxLYupo/b869ce9a3fcbd5060084b2a3a967005b/LE_-_Retirement_-_S1.svg',
      }}
      showFieldName
    />
  ),

  name: 'AutoWidth',
}
