import {
  buildCustomField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { overview } from '../../lib/messages'
import {
  getApplicantOverviewItems,
  getCardDeliveryOverviewItems,
} from '../../utils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: '',
      children: [
        buildCustomField({
          id: 'overview.header',
          doesNotRequireAnswer: true,
          component: 'OverviewHeader',
        }),
        buildOverviewField({
          id: 'overview.applicant',
          title: '',
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.cardDelivery',
          title: '',
          backId: 'cardDeliveryMultiField',
          items: getCardDeliveryOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
