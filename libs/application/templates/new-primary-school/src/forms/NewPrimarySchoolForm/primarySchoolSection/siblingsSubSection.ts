import {
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { ReasonForApplicationOptions } from '../../../utils/constants'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'

export const siblingsSubSection = buildSubSection({
  id: 'siblingsSubSection',
  title: primarySchoolMessages.siblings.subSectionTitle,
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
      title: primarySchoolMessages.siblings.title,
      children: [
        buildTableRepeaterField({
          id: 'siblings',
          formTitle: primarySchoolMessages.siblings.registrationTitle,
          addItemButtonText: primarySchoolMessages.siblings.addSibling,
          saveItemButtonText: primarySchoolMessages.siblings.registerSibling,
          removeButtonTooltipText: primarySchoolMessages.siblings.deleteSibling,
          editButtonTooltipText: primarySchoolMessages.siblings.editSibling,
          marginTop: 0,
          editField: true,
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              searchPersons: true,
              customNameLabel: sharedMessages.fullName,
            },
          },
          table: {
            format: {
              nationalId: (value) => formatKennitala(value),
            },
            header: [sharedMessages.fullName, sharedMessages.nationalId],
          },
        }),
      ],
    }),
  ],
})
