import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'

export const injuredBodyPartsSection = buildSubSection({
  id: 'injuredBodyParts',
  title: sections.draft.injuredBodyParts,
  children: [
    buildMultiField({
      title: '',
      children: [],
    }),
  ],
})
