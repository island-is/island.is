import { defineMessage, defineMessages } from 'react-intl'

export const rulingAccordion = {
  title: defineMessage({
    id: 'judicial.system.core:ruling_accordion.title',
    defaultMessage: 'Úrskurður Héraðsdóms',
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
    appealDecision: defineMessages({
      disclaimer: {
        id: 'judicial.system.core:ruling_accordion.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum í úrskurðar fellilista í öllum málategundum.',
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
    conclusion: defineMessages({
      title: {
        id: 'judicial.system.core:ruling_accordion.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutanum í úrskurðar fellilista í öllum málategundum.',
      },
      disclaimer: {
        id: 'judicial.system.core:ruling_accordion.conclusion.disclaimer',
        defaultMessage:
          'Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.',
        description:
          'Notaður sem texti undir "Úrskurðarorð" hlutanum í úrskurðar fellilista í gæslu- og farbannsmálum og í rannsóknarheimildum þar sem fyrirtaka er ekki haldin í fjarfundi.',
      },
    }),
  },
}
