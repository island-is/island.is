import { defineMessages } from 'react-intl'

export const rcCourtOverview = {
  sections: {
    title: {
      id: 'rcCourtOverview.sections.title',
      defaultMessage:
        'Yfirlit {caseType, select, ADMISSION_TO_FACILITY {kröfu um vistun á viðeigandi stofnun} TRAVEL_BAN {farbannskröfu} other {gæsluvarðhaldskröfu}}',
      description:
        'Notaður sem titill á yfirlitssíðu í gæsluvarðhalds-, vistunar- og farbannsmálum.',
    },
    caseResentExplanation: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:reception_and_assignment.case_resent_explanation.title',
        defaultMessage: 'Athugasemdir vegna endursendingar',
        description:
          'Notaður sem titill fyrir athugasemdir vegna endursendingar hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    seenByDefenderAlert: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:court_overview.sections.seen_by_defender_alert.title',
        defaultMessage: 'Krafa sótt af verjanda',
        description:
          'Notaður sem titill fyrir "Krafa sótt af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:court_overview.sections.seen_by_defender_alert.text',
        defaultMessage:
          'Verjandi skráði sig inn til að sækja kröfuskjal {when}.',
        description:
          'Notaður sem titill fyrir "Krafa sótt af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  continueButton: defineMessages({
    label: {
      id: 'judicial.system.restriction_cases:court.continue_button.label',
      defaultMessage: 'Skrá fyrirtökutíma',
      description:
        'Titill takka sem sendir notanda í næstu síðu í yfirlitssíðu í gæsluvarðhanlds- og farbannsmálum.',
    },
  }),
}
