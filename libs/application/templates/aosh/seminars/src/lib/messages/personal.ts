import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:personal.general.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: `personal page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:personal.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: `personal section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:personal.general.pageDescription',
      defaultMessage: 'Upplýsingar um skráningaraðila',
      description: `personal page description `,
    },
  }),
  labels: defineMessages({
    userName: {
      id: 'aosh.sem.application:personal.labels.userName',
      defaultMessage: 'Full nafn',
      description: `user name `,
    },
    userNationalId: {
      id: 'aosh.sem.application:personal.labels.userNationalId',
      defaultMessage: 'Kennitala',
      description: `user nationalId `,
    },
  }),
}
