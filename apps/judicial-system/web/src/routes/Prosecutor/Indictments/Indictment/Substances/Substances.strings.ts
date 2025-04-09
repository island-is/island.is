import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  substanceTitle: {
    id: 'judicial.system.core:substances.title',
    defaultMessage:
      '{substanceType, select, ILLEGAL_DRUGS_DRIVING {Fíkniefni} PRESCRIPTION_DRUGS_DRIVING {Lyf} other {Efni}}',
    description:
      'Notaður sem titill á "veldu" lista á ákæruliða skrefi í ákærum.',
  },
  substanceLabel: {
    id: 'judicial.system.core:substances.label',
    defaultMessage:
      '{substanceType, select, ILLEGAL_DRUGS_DRIVING {Fíkniefni} PRESCRIPTION_DRUGS_DRIVING {Lyf} other {Efni}}',
    description:
      'Notaður sem titill á "veldu" lista á ákæruliða skrefi í ákærum.',
  },
  substancePlaceholder: {
    id: 'judicial.system.core:substances.placeholder',
    defaultMessage:
      'Veldu {substanceType, select, ILLEGAL_DRUGS_DRIVING {fíkniefni} PRESCRIPTION_DRUGS_DRIVING {lyf} other {efni}}',
    description:
      'Notaður sem skýritexti á "veldu" lista á ákæruliða skrefi í ákærum.',
  },
})
