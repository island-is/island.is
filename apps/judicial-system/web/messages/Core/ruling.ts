import { defineMessage, defineMessages } from 'react-intl'

export const ruling = {
  label: defineMessage({
    id: 'judicial.system.core:ruling.label',
    defaultMessage: 'Efni úrskurðar',
    description:
      'Notaður sem titill í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  }),
  placeholder: defineMessage({
    id: 'judicial.system.core:ruling.placeholder',
    defaultMessage: 'Hver er niðurstaðan að mati dómara?',
    description:
      'Notaður sem skýritexti í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  }),
  autofill: defineMessage({
    id: 'judicial.system.core:ruling.autofill',
    defaultMessage: '{judgeName} héraðsdómari kveður upp úrskurð þennan.',
    description:
      'Notaður sem sjálfgefinn texti í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  }),
  sections: {
    courtCaseFacts: defineMessages({
      prefill: {
        id: 'judicial.system.core:ruling.sections.court_case_facts.prefill',
        defaultMessage:
          'Í greinargerð sóknaraðila er atvikum lýst svo: {caseFacts}',
        description:
          'Notaður sem sjálfgefinn texti í málsatvik textaboxi á úrskurðar skrefi í öllum málstegundum.',
      },
    }),
    courtLegalArguments: defineMessages({
      prefill: {
        id: 'judicial.system.core:ruling.sections.court_legal_arguments.prefill',
        defaultMessage:
          'Í greinargerð er krafa sóknaraðila rökstudd þannig: {legalArguments}',
        description:
          'Notaður sem sjálfgefinn texti í málsatvik textaboxi á úrskurðar skrefi í öllum málstegundum.',
      },
    }),
  },
  investigationCases: {
    sections: {
      decision: defineMessages({
        acceptLabel: {
          id: 'judicial.system.core:ruling.investigation_cases.sections.decision.accept_label',
          defaultMessage: 'Krafa samþykkt',
          description:
            'Notaður sem texti við radio takka með vali um að samþykkja rannsóknarheimild á úrskurðar skrefi í rannsóknarheimildum.',
        },
        rejectLabel: {
          id: 'judicial.system.core:ruling.investigation_cases.sections.decision.reject_label',
          defaultMessage: 'Kröfu hafnað',
          description:
            'Notaður sem texti við radio takka með vali um að hafna rannsóknarheimild á úrskurðar skrefi í rannsóknarheimildum.',
        },
        partiallyAcceptLabel: {
          id: 'judicial.system.core:ruling.investigation_cases.sections.decision.partially_accept_label',
          defaultMessage: 'Krafa tekin til greina að hluta',
          description:
            'Notaður sem texti við radio takka með vali um að samþykkja rannsóknarheimild að hluta á úrskurðar skrefi í rannsóknarheimildum.',
        },
        dismissLabel: {
          id: 'judicial.system.core:ruling.investigation_cases.sections.ruling.decision.dismiss_label',
          defaultMessage: 'Kröfu vísað frá',
          description:
            'Notaður sem texti við radio takka með vali um að vísa máli frá á úrskurðar skrefi í rannsóknarheimildum.',
        },
      }),
    },
  },

  restrictionCases: {
    sections: {
      decision: defineMessages({
        caseType: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.case_type',
          defaultMessage:
            '{caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
          description:
            'Notaður sem texti við radio takka með vali um að samþykkja/hafna/vísa frá kröfu á úrskurðar skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
        },
        acceptLabel: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.accept_label',
          defaultMessage: 'Krafa um {caseType} samþykkt',
          description:
            'Notaður sem texti við radio takka með vali um að samþykkja gæsluvarðhald á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        partiallyAcceptLabel: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.partially_accept_label',
          defaultMessage: 'Krafa um {caseType} tekin til greina að hluta',
          description:
            'Notaður sem texti við radio takka með vali um að samþykkja gæsluvarðhald að hluta á úrskurðar skrefi í gæsluvarðhalds- og vistunarmálum.',
        },
        rejectLabel: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.reject_label',
          defaultMessage: 'Kröfu um {caseType} hafnað',
          description:
            'Notaður sem texti við radio takka með vali um að hafna gæsluvarðhaldi á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        dismissLabel: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.dismiss_label',
          defaultMessage: 'Kröfu um {caseType} vísað frá',
          description:
            'Notaður sem texti við radio takka með vali um að vísa máli frá á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        acceptingAlternativeTravelBanLabel: {
          id: 'judicial.system.core:ruling.restriction_cases.sections.decision.accepting_alternative_travel_ban_label',
          defaultMessage: 'Kröfu um {caseType} hafnað en úrskurðað í farbann',
          description:
            'Notaður sem texti við radio takka með vali um að hafna gæsluvarðhaldi en úrskurða í farbann á úrskurðar skrefi í gæsluvarðhalds- og vistunarfálum.',
        },
      }),
    },
  },
}
