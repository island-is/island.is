import { dedent } from 'ts-dedent'

import { DescriptionFormField } from './DescriptionFormField'

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
  title: 'Application System/DescriptionFormField',
  component: DescriptionFormField,
}

export const Default = {
  render: () => (
    <DescriptionFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: '',
        description: 'Field description',
      }}
    />
  ),

  name: 'Default',
}
