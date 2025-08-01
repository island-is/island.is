import { dedent } from 'ts-dedent'

import { FieldsRepeaterFormField } from './FieldsRepeaterFormField'

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
  title: 'Application System/FieldsRepeaterFormField',
  component: FieldsRepeaterFormField,
}

export const Default = {
  render: () => (
    <FieldsRepeaterFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'My repeater',
        formTitle: 'Add new contact',
        addItemButtonText: 'Add new contact',
        saveItemButtonText: 'Save',

        fields: {
          email: {
            component: 'input',
            type: 'email',
            label: 'Email',
            width: 'half',
          },

          phone: {
            component: 'input',
            label: 'Phone',
            type: 'tel',
            format: '###-####',
            placeholder: '000-0000',
          },

          radio: {
            component: 'radio',
            label: 'Radio',

            options: [
              {
                label: 'Option 1',
                value: '1',
              },
              {
                label: 'Option 2',
                value: '2',
              },
            ],

            placeholder: 'placeholder',
          },
        },

        table: {
          format: {
            phone: (value) => value.replace(/^(.{3})/, '$1-'),
          },
        },
      }}
    />
  ),

  name: 'Default',
}
