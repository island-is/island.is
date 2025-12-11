import {
  buildCheckboxField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { ApplicationFeatureKey } from '../../../utils/constants'
import { shouldShowPage } from '../../../utils/conditionUtils'

export const termsSubSection = buildSubSection({
  id: 'termsSubSection',
  title: newPrimarySchoolMessages.differentNeeds.termsSubSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(answers, externalData, ApplicationFeatureKey.TERMS),
  children: [
    buildCheckboxField({
      id: 'acceptTerms',
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
