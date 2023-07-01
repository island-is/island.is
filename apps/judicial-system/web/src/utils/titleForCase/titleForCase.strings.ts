import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  investigationCaseRejectedTitle: {
    id: 'judicial.system.core:overview_header.investigation_case_rejected_title',
    defaultMessage: 'Kröfu um rannsóknarheimild hafnað',
    description:
      'Notaður sem titill þegar kröfu um rannsóknarheimild er hafnað.',
  },
  restrictionCaseRejectedTitle: {
    id: 'judicial.system.core:overview_header.restriction_case_rejected_title',
    defaultMessage: 'Kröfu hafnað',
    description:
      'Notaður sem titill þegar kröfu um gæslu/vistun/farbann er hafnað.',
  },
  caseDismissedTitle: {
    id: 'judicial.system.core:overview_header.case_dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description: 'Notaður sem titill þegar kröfu er vísað frá.',
  },
  investigationCaseAcceptedTitle: {
    id: 'judicial.system.core:overview_header.investigation_case_accepted_title',
    defaultMessage: 'Krafa um rannsóknarheimild samþykkt',
    description:
      'Notaður sem titill þegar krafa um rannsóknarheimild er samþykkt.',
  },
  restrictionCaseActiveTitle: {
    id: 'judicial.system.core:overview_header.restriction_case_active_title',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
    description:
      'Notaður sem titill þegar krafa um gæslu/vistun/farbann er samþykkt og enn í gildi.',
  },
  restrictionCaseExpiredTitle: {
    id: 'judicial.system.core:overview_header.restriction_case_expired_title',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
    description:
      'Notaður sem titil þegar krafa um gæslu/vistun/farbann er samþykkt og fallin úr gildi.',
  },
  investigationCaseInProgressTitle: {
    id: 'judicial.system.core:overview_header.investigation_case_in_progress_title',
    defaultMessage:
      'Krafa um {isExtended, select, true {framlengingu á } other {}}rannsóknarheimild',
    description:
      'Notaður sem titill þegar krafa um rannsóknarheimild er í vinnslu.',
  },
  restrictionCaseInProgressTitle: {
    id: 'judicial.system.core:overview_header.restriction_case_in_progress_title',
    defaultMessage:
      'Krafa um {caseType, select, ADMISSION_TO_FACILITY {{isExtended, select, true {framlengingu á } other {}}vistun á viðeigandi stofnun} TRAVEL_BAN {{isExtended, select, true {framlengingu á farbanni} other {farbann}}} other {{isExtended, select, true {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}}',
    description:
      'Notaður sem titill þegar krafa um gæslu/vistun/farbann er í vinnslu.',
  },
})
