import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overview.section',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview.multifield',
      title: overview.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'overview',
          title: overview.general.sectionTitle,
          component: 'FormOverview',
        }),
        buildSubmitField({
          id: 'overview.submit',
          title: '',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.labels.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
