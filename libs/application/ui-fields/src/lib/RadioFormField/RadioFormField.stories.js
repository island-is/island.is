import { dedent } from 'ts-dedent'

import { RadioFormField } from './RadioFormField'

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
  title: 'Application System/RadioFormField',
  component: RadioFormField,
}

export const Default = {
  render: () => (
    <RadioFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',

        options: [
          {
            value: 'yes',
            label: 'Yes',
          },
          {
            value: 'no',
            label: 'No',
          },
        ],

        width: 'half',
      }}
    />
  ),

  name: 'Default',
}
