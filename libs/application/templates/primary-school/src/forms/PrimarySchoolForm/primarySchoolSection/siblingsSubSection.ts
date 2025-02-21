import {
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const siblingsSubSection = buildSubSection({
  id: 'siblingsSubSection',
  title: primarySchoolMessages.primarySchool.siblingsSubSectionTitle,
  condition: (answers) => {
    // Only display section if "Siblings in the same primary school" selected as reason for application
    const { reasonForApplication } = getApplicationAnswers(answers)
    return (
      reasonForApplication ===
      ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
    )
  },
  children: [
    buildMultiField({
      id: 'siblings',
      title: primarySchoolMessages.primarySchool.siblingsTitle,
      children: [
        buildTableRepeaterField({
          id: 'siblings',
          formTitle:
            primarySchoolMessages.primarySchool.siblingsRegistrationTitle,
          addItemButtonText:
            primarySchoolMessages.primarySchool.siblingsAddRelative,
          saveItemButtonText:
            primarySchoolMessages.primarySchool.siblingsRegisterRelative,
          removeButtonTooltipText:
            primarySchoolMessages.primarySchool.siblingsDeleteRelative,
          marginTop: 0,
          fields: {
            fullName: {
              component: 'input',
              label: primarySchoolMessages.shared.fullName,
              width: 'half',
              type: 'text',
              dataTestId: 'sibling-full-name',
            },
            nationalId: {
              component: 'input',
              label: primarySchoolMessages.shared.nationalId,
              width: 'half',
              type: 'text',
              format: '######-####',
              placeholder: '000000-0000',
              dataTestId: 'sibling-national-id',
            },
          },
          table: {
            format: {
              nationalId: (value) => formatKennitala(value),
            },
            header: [
              primarySchoolMessages.shared.fullName,
              primarySchoolMessages.shared.nationalId,
            ],
          },
        }),
      ],
    }),
  ],
})
