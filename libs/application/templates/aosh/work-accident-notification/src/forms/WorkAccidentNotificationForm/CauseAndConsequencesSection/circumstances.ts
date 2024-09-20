import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const circumstancesSection = buildSubSection({
  id: 'circumstances',
  title: sections.draft.circumstances,
  children: [
    buildMultiField({
      title: causeAndConsequences.circumstances.title,
      description: causeAndConsequences.circumstances.description,
      children: [
        buildCustomField({
          id: 'circumstances.physicalActivities',
          title: '',
          component: 'Circumstance',
        }),
      ],
    }),
  ],
})
