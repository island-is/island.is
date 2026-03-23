import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { overview } from '../../lib/messages'
import { overviewFields } from '../../utils/overviewFields'

export const overviewSection = buildSection({
  id: 'overview.section',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview.multifield',
      title: overview.general.sectionTitle,
      children: [
        ...overviewFields(),
        buildSubmitField({
          id: 'overview.submit',
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
