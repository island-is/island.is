import { dedent } from 'ts-dedent'

import { CheckboxFormField } from './CheckboxFormField'

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
  title: 'Application System/CheckboxFormField',
  component: CheckboxFormField,
}

export const Default = {
  render: () => (
    <CheckboxFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        large: true,
        backgroundColor: 'blue',
        width: 'half',

        options: [
          {
            value: 'phone',
            label: 'Phone',
            subLabel: 'Used to send notifications.',
          },
          {
            value: 'email',
            label: 'Email',
            subLabel: 'Used to send newsletters.',
          },
        ],
      }}
    />
  ),

  name: 'Default',
}

export const ListOfCheckboxes = {
  render: () => (
    <CheckboxFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',

        options: [
          {
            value: 'apple',
            label: 'Apple',
          },
          {
            value: 'facebook',
            label: 'Facebook',
          },
          {
            value: 'google',
            label: 'Google',
          },
        ],
      }}
    />
  ),

  name: 'List of checkboxes',
}
