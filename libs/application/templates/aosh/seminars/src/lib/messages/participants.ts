import { defineMessages } from 'react-intl'

export const participants = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:participants.general.pageTitle',
      defaultMessage: 'Þáttakendur',
      description: `Participants page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:participants.general.sectionTitle',
      defaultMessage: 'Þáttakendur',
      description: `Participants section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:participants.general.pageDescription',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: `Participants page description `,
    },
  }),
  labels: defineMessages({
    csvError: {
      id: 'aosh.sem.application:participants.labels.csvError',
      defaultMessage:
        'Athugið: csv sniðmátið virðist ekki vera rétt. Vinsamlegast farið yfir. Einnig er hægt að hlaða niður sniðmáti hér að ofan.',
      description: `Participants csv upload error `,
    },
    uploadHeader: {
      id: 'aosh.sem.application:participants.labels.uploadHeader',
      defaultMessage: 'Skrá marga umsækjendur í einu',
      description: 'participants csv upload header',
    },
    uploadButton: {
      id: 'aosh.sem.application:participants.labels.uploadButton',
      defaultMessage: 'Hlaða inn .csv skjali',
      description: 'participants csv upload button label',
    },
  }),
}
