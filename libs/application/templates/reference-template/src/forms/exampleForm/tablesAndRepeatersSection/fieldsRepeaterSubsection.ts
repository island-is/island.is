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
            'FieldsRepeater virkar svipað og tableRepeater, að því leiti að inni í honum er skilgreint eitthvað sett af field-um til að fylla út í og þetta sett er hægt að endurtaka eins oft og þarf. Munurinn er að í tableRepeater fara gildin inn í töflu en í fieldsRepeater þá sjást alltaf öll field sem búið er að búa til.',
        }),
        buildFieldsRepeaterField({
          id: 'fieldsRepeater',
          title: 'Fields Repeater',
          formTitle: 'Title for each form',
          width: 'half',
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
