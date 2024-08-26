import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'

export const deviationSection = buildSubSection({
  id: 'deviation',
  title: sections.draft.deviation,
  children: [
    buildMultiField({
      title: '',
      children: [],
    }),
  ],
})
