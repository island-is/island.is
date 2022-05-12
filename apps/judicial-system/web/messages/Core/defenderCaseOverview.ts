import { defineMessage, defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const defenderCaseOverview = {
  title: defineMessages({
    investigationCaseRejected: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.investigation_case_rejected',
      defaultMessage: 'Kröfu um rannsóknarheimild hafnað',
      description:
        'Notaður sem titil á yfirlitsskjá verjanda þegar kr0fu um rannsóknarheimild hefur verið hafnað.',
    }),
    restrictionCaseRejected: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.restriction_case_rejected',
      defaultMessage: 'Kröfu hafnað',
      description:
        'Notaður sem titil á yfirlitsskjá verjanda þegar kröfu um gæslu/vistun/farbann hefur verið hafnað.',
    }),
    caseDismissed: defineMessage({
      id: 'judicial.system.core:defender_case_overview.title.case_dismissed',
      defaultMessage: 'Kröfu vísað frá',
      description:
        'Notaður sem titill á yfirlitsskjá verjanda þegar kröfu hefur verið vísað frá.',
    }),
    investigationCaseAccepted: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.investigation_case_accepted',
      defaultMessage: 'Krafa um rannsóknarheimild samþykkt',
      description:
        'Notaður sem titil á yfirlitsskjá verjanda þegar krafa um rannsóknarheimild hefur verið samþykkt.',
    }),
    restrictionCaseExpired: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.restriction_case_expired',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
      description:
        'Notaður sem titil á yfirlitsskjá verjanda þegar gæslu/vistun/farbanni er lokið.',
    }),
    restrictionCaseActive: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.restriction_case_active',
      defaultMessage:
        '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
      description:
        'Notaður sem titil á yfirlitsskjá verjanda þegar gæsla/vistun/farbann er ekki lokið.',
    }),
    restrictionCaseScheduled: defineMessage({
      id:
        'judicial.system.core:defender_case_overview.title.restriction_case_scheduled',
      defaultMessage:
        'Krafa um {caseType, select, ADMISSION_TO_FACILITY {{isExtended, select, true {framlengingu á } other {}}vistun á viðeigandi stofnun} TRAVEL_BAN {{isExtended, select, true {framlengingu á farbanni} other {farbann}}} other {{isExtended, select, true {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}}',
      description:
        'Notaður sem titill á yfirlitsskjá verjanda þegar kröfu um gæslu/vistun/farbann hefur verið úthlutað fyrirtökutíma.',
    }),
  }),
  rulingDate: defineMessage({
    id: 'judicial.system.core:defender_case_overview.ruling_date',
    defaultMessage: 'Úrskurðað {courtEndTime}',
    description: 'Notaður fyrir tíma úrskurðar á yfirlitsskjá verjanda.',
  }),
  modifiedDatesHeading: defineMessage({
    id: 'judicial.system.core:defender_case_overview.modified_dates_heading',
    defaultMessage:
      'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} uppfærð',
    description:
      'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá verjanda.',
  }),
  conclusionHeading: defineMessage({
    id: 'judicial.system.core:defender_case_overview.conclusion_heading',
    defaultMessage: 'Úrskurðarorð',
    description:
      'Notaður sem titill fyrir úrskurðarorð á yfirlitsskjá verjanda.',
  }),
  documentHeading: defineMessage({
    id: 'judicial.system.core:defender_case_overview.document_heading',
    defaultMessage: 'Skjöl málsins',
    description:
      'Notaður sem titill fyrir skjöl málsins á yfirlitsskjá verjanda.',
  }),
  unsignedDocument: defineMessage({
    id: 'judicial.system.core:defender_case_overview.unsigned_document',
    defaultMessage: 'Bíður undirritunar',
    description:
      'Notaður sem texti fyrir óundirritað skjal á yfirlitsskjá verjanda.',
  }),
}
