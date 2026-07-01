import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const sectionAdditionalSummary = buildSubSection({
  id: 'additionalSummary',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.applicationEligibilityTitle,
      description: m.eligibilityRequirementTitle,
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'ApplicationSummary',
          id: 'appsummary',
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
