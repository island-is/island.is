import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:general.dataProvider.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: `Information page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:general.dataProvider.pageDescription',
      defaultMessage: 'Upplýsingar um skráningaraðila',
      description: `Information page description`,
    },

    sectionTitle: {
      id: 'aosh.pe.application:general.dataProvider.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: `Information section title`,
    },
  }),
  // alerts: defineMessages({
  //   alertMessage: {
  //     id: 'aosh.pe.application:alerts.alertMessage#markdown',
  //     defaultMessage:
  //       'Ef netfang og símanúmer er ekki rétt hér að neðan þá verður að breyta þeim upplýsingum á mínum síðum.',
  //     description:
  //       'Alerting user to update their email and phone number on my pages',
  //   },
  //   alertMessageLink: {
  //     id: 'aosh.pe.application:alerts.alertMessageLink',
  //     defaultMessage: '/minarsidur',
  //     description: 'Link for mínar síður',
  //   },
  //   alertMessageLinkTitle: {
  //     id: 'aosh.pe.application:alerts.alertMessageLinkTitle',
  //     defaultMessage: 'Fara á mínar síður',
  //     description: 'title for mínar síður link',
  //   },
  // }),
}
