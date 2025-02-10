import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const deviationSection = (index: number) =>
  buildSubSection({
    id: `deviations[${index}]`,
    title: sections.draft.deviation,
    children: [
      buildMultiField({
        title: causeAndConsequences.deviations.title,
        description: causeAndConsequences.deviations.description,
        id: `deviationsMultiField[${index}]`,
        children: [
          buildHiddenInput({
            id: `deviations[${index}].workDeviationsMostSerious`,
            doesNotRequireAnswer: true,
          }),
          buildCustomField(
            {
              id: `deviations[${index}].workDeviations`,
              title: '',
              component: 'Deviation',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
