import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { shipSelection } from '../../lib/messages'

export const shipSelectionSection = buildSection({
  id: 'shipSelectionSection',
  title: shipSelection.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'shipSelectionMultiField',
      title: shipSelection.general.title,
      description: shipSelection.general.description,
      children: [
        buildCustomField({
          id: 'shipSelection',
          doesNotRequireAnswer: true,
          component: 'ShipSelection',
        }),
      ],
    }),
  ],
})
