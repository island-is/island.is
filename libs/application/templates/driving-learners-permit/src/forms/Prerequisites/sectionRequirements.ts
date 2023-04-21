import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionRequirements = buildSubSection({
  id: 'requirements',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.eligibilityRequirementTitle,
      description: m.applicationEligibilityRequirementDescription,
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
      ],
    }),
  ],
})
