import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { childSafetyMessages } from '../../lib/messages'
import { isUnborn } from '../../utils/conditionUtils'

export const childSafetySection = buildSection({
  id: 'childSafetySection',
  title: childSafetyMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'childSafety',
      title: childSafetyMessages.shared.sectionTitle,
      description: childSafetyMessages.shared.description,
      children: [
        buildDescriptionField({
          id: 'childSafety.question',
          title: ({ answers }) =>
            isUnborn(answers)
              ? childSafetyMessages.unborn.sliderQuestion
              : childSafetyMessages.shared.sliderQuestion,
          titleVariant: 'h4',
          doesNotRequireAnswer: true,
          space: 2,
        }),
        // TODO: Add urgency level slider
        // TODO: Add info card (alertType: 'default') showing urgency assessment label + description from urgencyAssessments API
        // TODO: Add warning alert (alertType: 'warning') when slider value is 0-2
        // Data: urgencyAssessments from UrgencyAssessmentsApi (externalData), childSafetyUrgencyLevel in answers/dataSchema
      ],
    }),
  ],
})
