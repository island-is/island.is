import { defineMessages } from 'react-intl'

export const icCourtOverview = {
  sections: {
    // TODO: REMOVE caseResentExplanation
    caseResentExplanation: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.case_resent_explanation.title',
        defaultMessage: 'Athugasemdir vegna endursendingar',
        description:
          'Notaður sem titill fyrir athugasemdir vegna endursendingar hluta á yfirlitssíðu í rannsóknarheimildum.',
      },
    }),
    openedByDefenderAlert: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:court_overview.sections.opened_by_defender_alert.title',
        defaultMessage: 'Mál opnað af verjanda',
        description:
          'Notaður sem titill fyrir "Mál opnað af verjanda" hluta á yfirlitssíðu í rannsóknarheimildum.',
      },
      text: {
        id:
          'judicial.system.investigation_cases:court_overview.sections.opened_by_defender_alert.text',
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
