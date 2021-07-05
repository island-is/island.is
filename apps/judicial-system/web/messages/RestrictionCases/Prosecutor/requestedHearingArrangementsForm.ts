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
      id: 'judicial.system:form.requestCourt.arrestDate.heading',
      defaultMessage: 'Tími handtöku',
      description: 'Request court form arrest date: Heading',
    },
  }),
}
