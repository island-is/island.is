import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import { overview } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: overview.general.title,
      description: overview.general.description,
      children: [
        buildCustomField({
          id: 'overviewCustomField',
          title: '',
          doesNotRequireAnswer: true,
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'payment',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: overview.labels.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
