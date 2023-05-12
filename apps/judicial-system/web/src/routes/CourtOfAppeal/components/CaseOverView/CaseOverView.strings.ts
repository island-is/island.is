import { defineMessages } from 'react-intl'

export const courtOfAppealCaseOverview = defineMessages({
  appealedInfo: {
    id: 'judicial.system.core:court_of_appeal_overview.appealed_by',
    defaultMessage:
      'Kært af {appealedByProsecutor, select, true {sækjanda} other {verjanda}} {appealedDate}',
    description:
      'Notaður sem texti fyrir "Kært af" á yfirlitsskjá mála hjá Landsrétti.',
  },
})
