import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const injuredBodyPartsSection = buildSubSection({
  id: 'injuredBodyParts',
  title: sections.draft.injuredBodyParts,
  children: [
    buildMultiField({
      title: causeAndConsequences.injuredBodyParts.title,
      description: causeAndConsequences.injuredBodyParts.description,
      children: [
        buildHiddenInput({
          id: 'injuredBodyParts.partOfBodyInjuredMostSerious',
        }),
        buildCustomField({
          id: 'injuredBodyParts.partOfBodyInjured',
          title: '',
          component: 'InjuredBodyParts',
        }),
      ],
    }),
  ],
})
