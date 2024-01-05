import { defineMessages } from 'react-intl'

export const rcCourtOverview = {
  sections: {
    title: {
      id: 'judicial.system.restriction_cases:court_overview.sections.title',
      defaultMessage:
        'Yfirlit kröfu um {caseType, select, ADMISSION_TO_FACILITY {vistun á viðeigandi stofnun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
      description:
        'Notaður sem titill á yfirlitssíðu í gæsluvarðhalds-, vistunar- og farbannsmálum.',
    },
    openedByDefenderAlert: defineMessages({
      title: {
        id: 'judicial.system.restriction_cases:court_overview.sections.opened_by_defender_alert.title',
        defaultMessage: 'Mál opnað af verjanda',
        description:
          'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
      text: {
        id: 'judicial.system.restriction_cases:court_overview.sections.opened_by_defender_alert.text',
        defaultMessage: 'Verjandi hefur opnað málið í Réttarvörslugátt {when}.',
        description:
          'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
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
