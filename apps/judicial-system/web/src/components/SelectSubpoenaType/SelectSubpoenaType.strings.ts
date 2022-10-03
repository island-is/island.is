import { defineMessages } from 'react-intl'

export const selectSubpoenaType = defineMessages({
  arrestSummons: {
    id: 'judicial.system.core:select_subpoena_type.arrest_summons',
    defaultMessage: 'Handtökufyrirkall',
    description:
      'Notaður sem texti í Handtökufyrirkall radio takka í Tegund fyrirkalls svæði í öllum málategundum',
  },
  absenceSummons: {
    id: 'judicial.system.core:select_subpoena_type.absence_summons',
    defaultMessage: 'Útivistarfyrirkall',
    description:
      'Notaður sem texti í Útivistarfyrirkall radio takka í Tegund fyrirkalls svæði í öllum málategundum',
  },
})
