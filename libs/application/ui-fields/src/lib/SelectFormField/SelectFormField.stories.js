import { dedent } from 'ts-dedent'

import { SelectFormField } from './SelectFormField'

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
  title: 'Application System/SelectFormField',
  component: SelectFormField,
}

export const Default = {
  render: () => (
    <SelectFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',

        options: [
          {
            value: '20',
            label: '20%',
          },
          {
            value: '40',
            label: '40%',
          },
          {
            value: '60',
            label: '60%',
          },
          {
            value: '80',
            label: '80%',
          },
        ],

        backgroundColor: 'blue',
      }}
    />
  ),

  name: 'Default',
  height: '400px',
}

export const Multi = {
  render: () => (
    <SelectFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        isMulti: true,

        options: [
          {
            value: '20',
            label: '20%',
          },
          {
            value: '40',
            label: '40%',
          },
          {
            value: '60',
            label: '60%',
          },
          {
            value: '80',
            label: '80%',
          },
        ],

        backgroundColor: 'blue',
      }}
    />
  ),

  name: 'Multi',
  height: '400px',
}
