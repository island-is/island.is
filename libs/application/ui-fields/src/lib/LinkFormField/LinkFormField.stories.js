import { dedent } from 'ts-dedent'

import { LinkFormField } from './LinkFormField'

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
  title: 'Application System/LinkFormField',
  component: LinkFormField,
}

export const Default = {
  render: () => (
    <LinkFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Download PDF',
        s3Key: 'lorem_ipsum_pdf_key',
      }}
    />
  ),

  name: 'Default',
}
