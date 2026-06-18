import { defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const strings = defineMessages({
  modifiedDatesHeading: {
    id: 'judicial.system.core:defender_case_overview.modified_dates_heading',
    defaultMessage:
      'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} uppfærð',
    description:
      'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá verjanda.',
  },
  documentHeading: {
    id: 'judicial.system.core:defender_case_overview.document_heading',
    defaultMessage: 'Skjöl málsins',
    description:
      'Notaður sem titill fyrir skjöl málsins á yfirlitsskjá verjanda.',
  },
  unsignedRuling: {
    id: 'judicial.system.core:defender_case_overview.unsigned_ruling',
    defaultMessage: 'Úrskurður ekki undirritaður',
    description:
      'Texti sem birtist ef úrskurður er ekki undirritaður á yfirlitsskjá verjanda',
  },
  noRuling: {
    id: 'judicial.system.core:defender_case_overview.no_ruling',
    defaultMessage: 'Máli lokið án úrskurðar',
    description:
      'Texti sem birtist ef enginn úrskurður er skráður á yfirlitsskjá verjanda',
  },
})
