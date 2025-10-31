import {
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { ReasonForApplicationOptions } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'

export const siblingsSubSection = buildSubSection({
  id: 'siblingsSubSection',
  title: newPrimarySchoolMessages.primarySchool.siblingsSubSectionTitle,
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
      title: newPrimarySchoolMessages.primarySchool.siblingsTitle,
      children: [
        buildTableRepeaterField({
          id: 'siblings',
          formTitle:
            newPrimarySchoolMessages.primarySchool.siblingsRegistrationTitle,
          addItemButtonText:
            newPrimarySchoolMessages.primarySchool.siblingsAddRelative,
          saveItemButtonText:
            newPrimarySchoolMessages.primarySchool.siblingsRegisterRelative,
          removeButtonTooltipText:
            newPrimarySchoolMessages.primarySchool.siblingsDeleteRelative,
          marginTop: 0,
          editField: true,
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              searchPersons: true,
              dataTestId: 'sibling-national-id-with-name',
            },
          },
          table: {
            format: {
              nationalId: (value) => formatKennitala(value),
            },
            header: [
              newPrimarySchoolMessages.shared.fullName,
              newPrimarySchoolMessages.shared.nationalId,
            ],
          },
        }),
      ],
    }),
  ],
})
