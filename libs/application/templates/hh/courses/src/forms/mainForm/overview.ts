import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  getPayerOverviewItems,
  getParticipantOverviewTableData,
} from '../../utils/getOverviewItems'
import { m } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: m.overview.sectionTitle,
      children: [
        buildOverviewField({
          id: 'participantOverview',
          bottomLine: false,
          title: m.overview.participantHeading,
          tableData: getParticipantOverviewTableData,
        }),
        buildOverviewField({
          id: 'payerOverview',
          bottomLine: false,
          title: m.overview.payerHeading,
          items: getPayerOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: m.overview.submitTitle,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overview.submitTitle,
              type: 'primary',
            },
          ],
        }),
        buildDescriptionField({
          id: 'paymentWindowDescription',
          description: m.overview.paymentWindowDescription,
        }),
      ],
    }),
  ],
})
