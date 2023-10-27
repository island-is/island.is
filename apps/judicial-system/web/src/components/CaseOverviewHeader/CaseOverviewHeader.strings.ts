import { defineMessages } from 'react-intl'

export const CaseOverviewHeader = defineMessages({
  appealedBy: {
    id: 'judicial.system.core:case_overview_header.appealed_by',
    defaultMessage:
      'Kært af {appealedByProsecutor, select, true {sækjanda} other {verjanda}} {appealedDate}',
    description:
      'Notaður sem texti fyrir "Kært af" á yfirlitsskjá mála hjá Landsrétti.',
  },
  appealedByInCourt: {
    id: 'judicial.system.core:case_overview_header.appealed_by_in_court',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Varnaraðili}} kærði í þinghaldi',
    description:
      'Notaður sem texti fyrir "kærði í þinghaldi" á yfirlitsskjá mála hjá Landsrétti.',
  },
})
