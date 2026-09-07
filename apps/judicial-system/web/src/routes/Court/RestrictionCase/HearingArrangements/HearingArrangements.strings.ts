import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  title: defineMessage({
    id: 'judicial.system.core:restriction_cases_hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description:
      'Notaður sem titill á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    requestedCourtDate: defineMessages({
      title: {
        id: 'judicial.system.core:restriction_cases_hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Staður og stund fyrirtöku',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
