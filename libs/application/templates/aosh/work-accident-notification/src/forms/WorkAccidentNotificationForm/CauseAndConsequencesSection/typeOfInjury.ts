import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const typeOfInjurySection = (index: number) =>
  buildSubSection({
    id: 'typeOfInjury',
    title: sections.draft.typeOfInjury,
    children: [
      buildMultiField({
        title: causeAndConsequences.typeOfInjury.title,
        description: causeAndConsequences.typeOfInjury.description,
        children: [
          buildHiddenInput({
            id: 'typeOfInjury.typeOfInjuryMostSerious',
          }),
          buildCustomField({
            id: 'typeOfInjury.typeOfInjury',
            title: '',
            component: 'TypeOfInjury',
          }),
        ],
      }),
    ],
  })
