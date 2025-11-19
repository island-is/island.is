import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { childInCustody } from '../../../lib/messages'
import { isReportingOnBehalfOfChild } from '../../../utils/reportingUtils'

export const childInCustodySubSection = buildSubSection({
  id: 'childInCustody.section',
  title: childInCustody.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'childInCustody.fields',
      title: childInCustody.general.screenTitle,
      description: childInCustody.general.screenDescription,
      children: [
        buildTextField({
          id: 'childInCustody.name',
          backgroundColor: 'blue',
          title: childInCustody.labels.name,
          width: 'half',
          required: true,
          maxLength: 100,
        }),
        buildTextField({
          id: 'childInCustody.nationalId',
          backgroundColor: 'blue',
          title: childInCustody.labels.nationalId,
          format: '######-####',
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
  condition: (answers) => isReportingOnBehalfOfChild(answers),
})
