import { defineMessages } from 'react-intl'

export const icCourtOverview = {
  sections: {
    caseResentExplanation: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.case_resent_explanation.title',
        defaultMessage: 'Athugasemdir vegna endursendingar',
        description:
          'Notaður sem titill fyrir athugasemdir vegna endursendingar hluta á yfirlitssíðu í rannsóknarheimildum.',
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
