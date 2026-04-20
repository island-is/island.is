import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { childrenNGuardiansMessages } from '../../../lib/messages'

export const relativesSubSection = buildSubSection({
  id: 'relativesSubSection',
  title: childrenNGuardiansMessages.relatives.subSectionTitle,
  children: [
    buildMultiField({
      id: 'relatives',
      title: childrenNGuardiansMessages.relatives.title,
      description: childrenNGuardiansMessages.relatives.description,
      children: [
        buildCustomField({
          id: 'relatives',
          component: 'RelativesTableRepeater',
        }),
      ],
    }),
  ],
})
