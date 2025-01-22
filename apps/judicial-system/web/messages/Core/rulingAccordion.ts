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
    prosecutorDemands: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.prosecutor_demands.title',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "Dómkröfur" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
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
    ruling: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
    noRuling: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.no_ruling.title',
        defaultMessage: 'Máli er lokið án úrskurðar',
        description:
          'Notaður sem titill fyrir "Máli lokið án úrskurðar" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
    }),
  },
}
