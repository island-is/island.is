import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const OverviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultifield',
      title: overview.general.title,
      description: overview.general.description,
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.labels.approveButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.labels.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
