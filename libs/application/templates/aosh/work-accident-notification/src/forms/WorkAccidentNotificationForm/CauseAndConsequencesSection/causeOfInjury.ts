import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const causeOfInjurySection = buildSubSection({
  id: 'causeOfInjury',
  title: sections.draft.causeOfInjury,
  children: [
    buildMultiField({
      title: causeAndConsequences.causeOfInjury.title,
      description: causeAndConsequences.causeOfInjury.description,
      children: [
        buildHiddenInput({
          id: 'causeOfInjury.contactModeOfInjuryMostSerious',
        }),
        buildCustomField({
          id: 'causeOfInjury.contactModeOfInjury',
          title: '',
          component: 'CauseOfInjury',
        }),
      ],
    }),
  ],
})
