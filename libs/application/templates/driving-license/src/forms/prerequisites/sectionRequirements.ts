import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionRequirements = buildSubSection({
  id: 'requirements',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.eligibilityRequirementTitle,
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.orderDrivingLicense,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
