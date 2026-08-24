import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { getOverviewItems } from '../../utils/getOverviewItems'
import { overview as messages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: messages.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overview',
          title: messages.general.pageTitle,
          description: messages.general.description,
          backId: 'idToSomeField',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: messages.buttons.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: messages.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
