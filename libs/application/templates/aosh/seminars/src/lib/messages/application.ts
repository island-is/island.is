import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.sem.application:name',
    defaultMessage: 'Skráning á námskeið hjá Vinnueftirlitinu',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.sem.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.sem.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'aosh.sem.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'aosh.sem.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aosh.sem.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardPrerequisites: {
    id: 'aosh.sem.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  submissionErrorTitle: {
    id: 'aosh.sem.application:submissionErrorTitle',
    defaultMessage: 'Villa í umsókn',
    description: 'Submission error title',
  },
  submissionError: {
    id: 'aosh.sem.application:submissionError',
    defaultMessage: 'Ekki tókst að skrá námskeið, vinsamlegast reynið síðar',
    description: 'Submission error description',
  },
  confirmButtonLabel: {
    id: 'aosh.sem.application:confirmButtonLabel',
    defaultMessage: 'Staðfesta',
    description: 'Confirm button label',
  },
})
