import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import { overviewMessages } from '../../../lib/messages'
import { getOverviewItems } from '../../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.sectionTitle,
      description: overviewMessages.description,
      children: [
        buildOverviewField({
          id: 'overview',
          title: overviewMessages.sectionTitle,
          backId: 'idToSomeField',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overviewMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
