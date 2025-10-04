import {
  buildCheckboxField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const termsSubSection = buildSubSection({
  id: 'termsSubSection',
  title: newPrimarySchoolMessages.differentNeeds.termsSubSectionTitle,
  condition: () => {
    // TODO: Need to update when we get config from Júní and only show page for "sérskóli - hegðun" and "sérdeild - hegðun"
    return false
  },
  children: [
    buildCheckboxField({
      id: 'termsCheckbox',
      title: newPrimarySchoolMessages.differentNeeds.termsSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds.termsSubSectionDescription,
      required: true,
      options: [
        {
          label: newPrimarySchoolMessages.differentNeeds.termsCheckbox,
          value: YES,
        },
      ],
    }),
  ],
})
