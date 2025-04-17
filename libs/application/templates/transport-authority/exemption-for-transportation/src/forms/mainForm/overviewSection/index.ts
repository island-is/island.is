import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { getOverviewItems } from '../../../utils'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overview.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overview',
          title: 'Overview',
          description: 'This is an overview, should come from messages.ts',
          backId: 'idToSomeField',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
