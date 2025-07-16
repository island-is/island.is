import { dedent } from 'ts-dedent'

import { TableRepeaterFormField } from './TableRepeaterFormField'

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
  title: 'Application System/TableRepeaterFormField',
  component: TableRepeaterFormField,
}

export const Default = {
  render: () => (
    <TableRepeaterFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'My repeater',
        formTitle: 'Add new contact',
        addItemButtonText: 'Add new contact',
        saveItemButtonText: 'Save',

        fields: {
          name: {
            component: 'input',
            label: 'Name',
            width: 'full',
          },

          email: {
            component: 'input',
            label: 'Email',
            type: 'email',
            width: 'half',
          },

          phone: {
            component: 'input',
            label: 'Phone',
            type: 'tel',
            format: '###-####',
            width: 'half',
          },

          agreeToTerms: {
            component: 'checkbox',
            large: true,

            options: [
              {
                label: 'I agree to the terms',
                value: 'yes',
              },
            ],

            displayInTable: false,
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
