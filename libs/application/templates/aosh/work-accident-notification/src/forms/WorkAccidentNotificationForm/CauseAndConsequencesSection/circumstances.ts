import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const circumstancesSection = (index: number) =>
  buildSubSection({
    id: `circumstances[${index}]`,
    title: sections.draft.circumstances,
    children: [
      buildMultiField({
        title: causeAndConsequences.circumstances.title,
        description: causeAndConsequences.circumstances.description,
        id: `circumstancesMultiField[${index}]`,
        children: [
          buildHiddenInput({
            id: `circumstances[${index}].physicalActivitiesMostSerious`,
          }),
          buildCustomField(
            {
              id: `circumstances[${index}].physicalActivities`,
              title: '',
              component: 'Circumstance',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
