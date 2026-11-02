import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import {
  getProofOfTravelAttachments,
  getTripOverviewItems,
} from '../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'arrivalOverviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'arrivalOverviewMultiField',
      title: m.overview.arrivalTitle,
      description: m.overview.arrivalDescription,
      children: [
        buildOverviewField({
          id: 'tripOverview',
          backId: 'arrivalMultiField',
          bottomLine: false,
          items: getTripOverviewItems,
        }),
        buildOverviewField({
          id: 'proofOfTravelOverview',
          title: m.overview.attachments,
          backId: 'proofOfTravelMultiField',
          bottomLine: false,
          attachments: getProofOfTravelAttachments,
        }),
        buildSubmitField({
          id: 'submitArrival',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overview.registerArrival,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
