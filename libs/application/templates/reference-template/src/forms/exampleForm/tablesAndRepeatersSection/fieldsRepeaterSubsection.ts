import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  buildTextField,
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
          fields: {
            nationalId: {
              component: 'input',
              label: 'National ID',
              width: 'half',
              type: 'text',
              format: '######-####',
            },
            fullName: {
              component: 'input',
              label: 'Full name',
              width: 'half',
              type: 'text',
            },
          },
        }),
      ],
    }),
  ],
})
