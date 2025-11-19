import { dedent } from 'ts-dedent'

import { PhoneFormField } from './PhoneFormField'

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
  title: 'Application System/PhoneFormField',
  component: PhoneFormField,
}

export const Default = {
  render: () => (
    <PhoneFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        placeholder: 'Enter your phone',
        backgroundColor: 'blue',
      }}
      showFieldName
    />
  ),

  name: 'Default',
}
