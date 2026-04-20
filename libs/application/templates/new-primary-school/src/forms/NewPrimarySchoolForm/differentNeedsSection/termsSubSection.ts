import {
  buildCheckboxField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { differentNeedsMessages } from '../../../lib/messages'
import { ApplicationFeatureKey } from '../../../utils/constants'
import { shouldShowPage } from '../../../utils/conditionUtils'

export const termsSubSection = buildSubSection({
  id: 'termsSubSection',
  title: differentNeedsMessages.terms.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(answers, externalData, ApplicationFeatureKey.TERMS),
  children: [
    buildCheckboxField({
      id: 'acceptTerms',
      title: differentNeedsMessages.terms.subSectionTitle,
      description: differentNeedsMessages.terms.description,
      required: true,
      options: [
        {
          label: differentNeedsMessages.terms.checkbox,
          value: YES,
        },
      ],
    }),
  ],
})
