import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  investigationCaseRejected: {
    id: 'judicial.system.core:overview_header.investigation_case_rejected',
    defaultMessage: 'Kröfu um rannsóknarheimild hafnað',
    description: 'Headline when investigation case is rejected',
  },
  restrictionCaseRejected: {
    id: 'judicial.system.core:overview_header.restriction_case_rejected',
    defaultMessage: 'Kröfu hafnað',
    description:
      'Headline when case is  restriction case and has been rejected',
  },
  dismissedTitle: {
    id: 'judicial.system.core:overview_header.dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description:
      'Notaður sem titill á yfirlitsskjá afgreiddra mála þegar máli er vísað frá.',
  },
  validToDateInThePast: {
    id: 'judicial.system.core:overview_header.valid_to_date_in_the_past',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
    description:
      'Notaður sem titil á yfirlitsskjá afreiddra mála þegar dagsetning gæslu/vistunar/farbanni er liðin.',
  },
})
