import { defineMessages } from 'react-intl'

export const icCourtOverview = {
  sections: {
    openedByDefenderAlert: defineMessages({
      title: {
        id: 'judicial.system.investigation_cases:court_overview.sections.opened_by_defender_alert.title',
        defaultMessage: 'Mál opnað af verjanda',
        description:
          'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í rannsóknarheimildum.',
      },
      text: {
        id: 'judicial.system.investigation_cases:court_overview.sections.opened_by_defender_alert.text',
        defaultMessage: 'Verjandi hefur opnað málið í Réttarvörslugátt {when}.',
        description:
          'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í rannsóknarheimildum.',
      },
    }),
  },
  continueButton: defineMessages({
    label: {
      id: 'judicial.system.investigation_cases:court.continue_button.label',
      defaultMessage: 'Skrá fyrirtökutíma',
      description:
        'Titill takka sem sendir notanda í næstu síðu í yfirlitssíðu í rannsóknarheimildum.',
    },
  }),
}
