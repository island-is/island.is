import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const injuredBodyPartsSection = (index: number) =>
  buildSubSection({
    id: `injuredBodyParts[${index}]`,
    title: sections.draft.injuredBodyParts,
    children: [
      buildMultiField({
        title: causeAndConsequences.injuredBodyParts.title,
        description: causeAndConsequences.injuredBodyParts.description,
        id: `injuredBodyPartsMultiField[${index}]`,
        children: [
          buildHiddenInput({
            id: `injuredBodyParts[${index}].partOfBodyInjuredMostSerious`,
          }),
          buildCustomField(
            {
              id: `injuredBodyParts[${index}].partOfBodyInjured`,
              title: '',
              component: 'InjuredBodyParts',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
