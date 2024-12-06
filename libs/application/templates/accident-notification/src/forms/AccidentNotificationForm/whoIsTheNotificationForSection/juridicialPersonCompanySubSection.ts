import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { juridicalPerson } from '../../../lib/messages'
import { isReportingOnBehalfOfEmployee } from '../../../utils'
import { YES } from '../../../utils/constants'

export const juridicalPersonCompanySubSection = buildSubSection({
  id: 'juridicalPerson.company',
  title: juridicalPerson.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'juridicalPerson.company',
      title: juridicalPerson.general.title,
      description: juridicalPerson.general.description,
      children: [
        buildTextField({
          id: 'juridicalPerson.companyName',
          backgroundColor: 'blue',
          title: juridicalPerson.labels.companyName,
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'juridicalPerson.companyNationalId',
          backgroundColor: 'blue',
          title: juridicalPerson.labels.companyNationalId,
          format: '######-####',
          width: 'half',
          required: true,
        }),
        buildCheckboxField({
          id: 'juridicalPerson.companyConfirmation',
          title: '',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: juridicalPerson.labels.confirmation,
            },
          ],
        }),
      ],
    }),
  ],
  condition: (formValue) => isReportingOnBehalfOfEmployee(formValue),
})
