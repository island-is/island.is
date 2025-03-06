import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { instructor, shared } from '../../../lib/messages'

export const instructorSection = buildSection({
  id: 'instructorSection',
  title: instructor.general.sectionTitle,
  children: [
    buildMultiField({
      title: instructor.general.pageTitle,
      id: 'instructorsMultiField',
      description: instructor.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'instructors',
          title: '',
          addItemButtonText: instructor.tableRepeater.addInstructorButton,
          editField: true,
          fields: {
            nationalId: {
              component: 'nationalIdWithName',
              label: shared.labels.ssn,
            },
            email: {
              component: 'input',
              label: shared.labels.email,
              width: 'half',
              type: 'email',
            },
            phone: {
              component: 'input',
              label: shared.labels.phone,
              type: 'tel',
              format: '###-####',
              placeholder: '000-0000',
              width: 'half',
            },
          },
          table: {
            format: {
              nationalId: (value) => `${value.slice(0, 6)}-${value.slice(6)}`,
              phone: (value) => `${value.slice(0, 3)}-${value.slice(3)}`,
            },
          },
          //onSubmitLoad: ({apolloClient, application, tableItems }) => {

          //}
        }),
        buildCustomField({
          id: '',
          title: '',
          component: 'InstructorValidation',
        }),
      ],
    }),
  ],
})
