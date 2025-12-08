import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getPayerOverviewItems,
  getParticipantOverviewItems,
} from '../../utils/getOverviewItems'
import { m } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionHeading,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: m.overviewSectionHeading,
      children: [
        buildOverviewField({
          id: 'participantOverview',
          bottomLine: false,
          title: m.overviewSectionParticipantHeading,
          items: getParticipantOverviewItems,
        }),
        buildOverviewField({
          id: 'payerOverview',
          bottomLine: false,
          title: m.overviewSectionPayerHeading,
          items: getPayerOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: m.overviewSectionSubmit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.overviewSectionSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
