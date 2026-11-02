import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { getDepartureOverviewItems } from '../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'departureOverviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'departureOverviewMultiField',
      title: m.overview.departureTitle,
      description: m.overview.departureDescription,
      children: [
        buildOverviewField({
          id: 'departureOverview',
          backId: 'departureMultiField',
          bottomLine: false,
          items: getDepartureOverviewItems,
        }),
        buildSubmitField({
          id: 'submitDeparture',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overview.registerDeparture,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
