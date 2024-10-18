import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const typeOfInjurySection = (index: number) =>
  buildSubSection({
    id: `typeOfInjury[${index}]`,
    title: sections.draft.typeOfInjury,
    children: [
      buildMultiField({
        title: causeAndConsequences.typeOfInjury.title,
        description: causeAndConsequences.typeOfInjury.description,
        id: `typeOfInjuryMultiField[${index}]`,
        children: [
          buildHiddenInput({
            id: `typeOfInjury[${index}].typeOfInjuryMostSerious`,
          }),
          buildCustomField(
            {
              id: `typeOfInjury[${index}].typeOfInjury`,
              title: '',
              component: 'TypeOfInjury',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
