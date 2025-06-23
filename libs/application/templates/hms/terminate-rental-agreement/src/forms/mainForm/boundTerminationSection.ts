import {
  buildSection,
  buildMultiField,
  buildDateField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { isBoundTermination } from '../../utils/conditions'

export const boundTerminationSection = buildSection({
  condition: isBoundTermination,
  id: 'boundTerminationSection',
  title: m.boundTerminationMessages.title,
  children: [
    buildMultiField({
      id: 'boundTerminationMultiField',
      title: m.boundTerminationMessages.title,
      description: m.boundTerminationMessages.description,
      children: [
        buildDateField({
          id: 'boundTermination.boundTerminationDate',
          title: m.boundTerminationMessages.dateTitle,
        }),
      ],
    }),
  ],
})
