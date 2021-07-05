import { defineMessage, defineMessages } from 'react-intl'

export const requestedHearingArrangements = {
  heading: defineMessage({
    id:
      'judicial.system.restriction_cases:requested_hearing_arrangements.heading',
    defaultMessage: 'Óskir um fyrirtöku',
    description:
      'Notaður sem titill á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  arrestDate: defineMessages({
    heading: {
      id:
        'judicial.system:restriction_cases.requested_hearing_arrangements.arrest_date.heading',
      defaultMessage: 'Tími handtöku',
      description:
        'Notaður sem titill fyrir "tími handtöku" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
}
