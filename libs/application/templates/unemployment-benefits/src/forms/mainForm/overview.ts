import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { getOverviewItems } from '../../utils/getOverviewItems'
import { overview as overviewMessages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.general.pageTitle,
      description: overviewMessages.general.pageDescription,
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
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
