import { defineMessages } from 'react-intl'

export const restrictionLength = defineMessages({
  caseType: {
    id: 'judicial.system.core:restriction_lenght.case_type',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
    description:
      'Notaður sem titill fyrir "Breyta lengd" hluta í gæsluvarðhalds-, vistunar- og farbannsmálum.',
  },
  title: {
    id: 'judicial.system.core:restriction_lenght.isolation_title',
    defaultMessage: 'Einangrun',
    description:
      'Notaður sem titill fyrir "Takmarkanir á gæslu" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  isolation: {
    id: 'judicial.system.core:restriction_length.isolation_text',
    defaultMessage: 'Varnaraðili skal sæta einangrun',
    description:
      'Notaður sem texti sem segir til um einangrun á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  isolationDateLable: {
    id: 'judicial.system.core:restriction_length.isolation_date_label',
    defaultMessage: 'Einangrun til',
    description:
      'Notaður sem titill fyrir "Einangrun til" textabox á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  validToDateLabel: {
    id: 'judicial.system.core:restriction_length.valid_to_date_label',
    defaultMessage: '{caseType} til',
    description:
      'Notaður sem titill fyrir "Úrskurður gildir til" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
  },
})
