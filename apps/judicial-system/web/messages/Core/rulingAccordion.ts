import { defineMessage, defineMessages } from 'react-intl'

export const rulingAccordion = {
  heading: defineMessage({
    id: 'judicial.system.core:ruling_accordion.heading',
    defaultMessage: 'Úrskurður héraðsdóms',
    description:
      'Notaður sem yfirfyrirsögn fyrir úrskurðar fellilista í öllum málategundum.',
  }),
  title: defineMessage({
    id: 'judicial.system.core:ruling_accordion.title',
    defaultMessage: 'Úrskurður dómara',
    description:
      'Notaður sem titill fyrir úrskurðar fellilista í öllum málategundum.',
  }),
  sections: {
    courtLegalArguments: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.court_legal_arguments.title',
        defaultMessage: 'Lagarök',
        description:
          'Notaður sem titill fyrir "Lagarök" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
    courtCaseFacts: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.court_case_facts.title',
        defaultMessage: 'Málsatvik',
        description:
          'Notaður sem titill fyrir "Málsatvik" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
    requestProsecutorOnlySession: defineMessages({
      title: {
        id:
          'judicial.system.core:ruling_accordion.request_prosecutor_only_session.title',
        defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
        description:
          'Notaður sem titill fyrir "Beiðni um dómþing að varnaraðila fjarstöddum" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
    ruling: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
    appealDecisions: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.appeal_decisions.title',
        defaultMessage: 'Ákvörðun um kæru',
        description:
          'Notaður sem titill fyrir "Ákvörðun um kæru" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
      appealDirections: {
        id:
          'judicial.system.core:ruling_accordion.appeal_decisions.appeal_directions',
        defaultMessage:
          'Dómari kynnir rétt til að kæra úrskurð og um kærufrest skv. 193. gr. laga nr. 88/2008.',
        description:
          'Texti sem útskýrir kærufrest í úrskurðar fellilista í öllum málategundum.',
      },
    }),
  },
}
