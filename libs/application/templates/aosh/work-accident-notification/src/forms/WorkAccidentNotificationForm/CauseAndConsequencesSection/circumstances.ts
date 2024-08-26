import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'

export const circumstancesSection = buildSubSection({
  id: 'circumstances',
  title: sections.draft.circumstances,
  children: [
    buildMultiField({
      title: '',
      children: [],
    }),
  ],
})
