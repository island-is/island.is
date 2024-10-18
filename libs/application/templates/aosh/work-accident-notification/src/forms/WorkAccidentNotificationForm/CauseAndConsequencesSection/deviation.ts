import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const deviationSection = (index: number) =>
  buildSubSection({
    id: 'deviations',
    title: sections.draft.deviation,
    children: [
      buildMultiField({
        title: causeAndConsequences.deviations.title,
        description: causeAndConsequences.deviations.description,
        children: [
          buildHiddenInput({
            id: `deviations[${index}].workDeviationsMostSerious`,
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
