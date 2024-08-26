import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'

export const causeOfInjurySection = buildSubSection({
  id: 'causeOfInjury',
  title: sections.draft.causeOfInjury,
  children: [
    buildMultiField({
      title: '',
      children: [],
    }),
  ],
})
