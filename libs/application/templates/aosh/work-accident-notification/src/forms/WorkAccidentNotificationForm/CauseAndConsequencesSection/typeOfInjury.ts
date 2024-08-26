import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'

export const typeOfInjurySection = buildSubSection({
  id: 'typeOfInjury',
  title: sections.draft.typeOfInjury,
  children: [
    buildMultiField({
      title: '',
      children: [],
    }),
  ],
})
