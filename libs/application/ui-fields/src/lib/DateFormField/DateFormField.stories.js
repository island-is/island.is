import { dedent } from 'ts-dedent'

import { DateFormField } from './DateFormField'

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
  title: 'Application System/DateFormField',
  component: DateFormField,
}

export const Default = {
  render: () => (
    <DateFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        placeholder: 'Select a date',
        backgroundColor: 'blue',
      }}
    />
  ),

  name: 'Default',
  height: '425px',
}
