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
  title: m.applicationOverviewTitle,
  children: [
    buildMultiField({
      id: 'appsummaryMultiField',
      title: m.applicationOverviewTitle,
      children: [
        buildCustomField({
          id: 'appsummary',
          title: m.applicationOverviewTitle,
          description: m.applicationOverviewDescription,
          component: 'ApplicationSummary',
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
