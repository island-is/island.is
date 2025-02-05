import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const reviewOverviewSection = buildSection({
  id: 'reviewOverviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reviewOverviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildCustomField(
          {
            id: 'reviewOverview',
            title: '',
            component: 'Overview',
          },
          {
            hideActionButtons: true,
          },
        ),
        buildSubmitField({
          id: 'submitReview',
          placement: 'footer',
          title: overview.general.approveButton,
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: overview.general.rejectButton,
              type: 'reject',
            },
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.agreeButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
