import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const fieldsRepeaterSubsection = buildSubSection({
  id: 'fieldsRepeaterSubsection',
  title: 'Fields Repeater Field',
  children: [
    buildMultiField({
      id: 'fieldsRepeater',
      title: 'Fields Repeater',
      children: [
        buildDescriptionField({
          id: 'fieldsRepeaterDescription',
          title: '',
          description:
            'FieldsRepeater works similarly to tableRepeater, in that it contains a set of fields to fill out and this set can be repeated as many times as needed. The difference is that in tableRepeater, the values go into a table, while in fieldsRepeater, all fields created are always visible.',
        }),
        buildFieldsRepeaterField({
          id: 'fieldsRepeater',
          title: 'Fields Repeater',
          formTitle: 'Title for each form',
          width: 'full',
          fields: {
            input: {
              component: 'input',
              label: 'Regular input',
              width: 'half',
              type: 'text',
              format: '######-####',
            },
            select: {
              component: 'select',
              label: 'Select',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            radio: {
              component: 'radio',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
              ],
            },
            checkbox: {
              component: 'checkbox',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            date: {
              component: 'date',
              label: 'Date',
              width: 'half',
            },
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'National ID with name',
              searchCompanies: true,
              searchPersons: true,
            },
            phone: {
              component: 'phone',
              label: 'Phone',
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
