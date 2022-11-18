import { defineMessages } from 'react-intl'

export const cardType = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:cardType.general.sectionTitle',
      defaultMessage: 'Tegund korts',
      description: 'Title of card type section',
    },
    pageTitle: {
      id: 'ta.dtdc.application:cardType.general.pageTitle',
      defaultMessage: 'Upplýsingar um tegund korts',
      description: 'Title of card type page',
    },
    description: {
      id: 'ta.dtdc.application:cardType.general.pageTitle',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of card type page',
    },
  }),
  labels: {
    newestCard: defineMessages({
      subtitle: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.subtitle',
        defaultMessage: 'Nýjasta kort úr ökutækjaskrá',
        description: 'Newest card subtitle',
      },
      applicationCreatedAt: {
        id:
          'ta.dtdc.application:cardType.labels.newestCard.applicationCreatedAt',
        defaultMessage: 'Dagsetning umsóknar',
        description: 'Newest card application created at',
      },
      cardNumber: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.cardNumber',
        defaultMessage: 'Númer korts',
        description: 'Newest card card number',
      },
      cardValidFrom: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.cardValidFrom',
        defaultMessage: 'Gildir frá',
        description: 'Newest card card valid from',
      },
      cardValidTo: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.cardValidTo',
        defaultMessage: 'Gildir til',
        description: 'Newest card card valid to',
      },
      countryOfIssue: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.countryOfIssue',
        defaultMessage: 'Útgáfuland',
        description: 'Newest card country of issue',
      },
      countryOfIssueIceland: {
        id:
          'ta.dtdc.application:cardType.labels.newestCard.countryOfIssueIceland',
        defaultMessage: 'Ísland',
        description: 'Newest card country of issue iceland',
      },
    }),
  },
}
