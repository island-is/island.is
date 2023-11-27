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
      id: 'ta.dtdc.application:cardType.general.description',
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
        id: 'ta.dtdc.application:cardType.labels.newestCard.applicationCreatedAt',
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
      isValid: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.isValid',
        defaultMessage: 'Staða',
        description: 'Newest card is valid',
      },
      isValidYes: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.isValidYes',
        defaultMessage: 'Er gilt',
        description: 'Newest card is valid yes',
      },
      isValidNo: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.isValidNo',
        defaultMessage: 'Er ekki gilt',
        description: 'Newest card is valid no',
      },
      countryOfIssue: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.countryOfIssue',
        defaultMessage: 'Útgáfuland',
        description: 'Newest card country of issue',
      },
      countryOfIssueIceland: {
        id: 'ta.dtdc.application:cardType.labels.newestCard.countryOfIssueIceland',
        defaultMessage: 'Ísland',
        description: 'Newest card country of issue iceland',
      },
    }),
    cardType: defineMessages({
      subtitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.subtitle',
        defaultMessage: 'Merkið við eftir því sem við á',
        description: 'Card type subtitle',
      },
      firstEditionOptionTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.firstEditionOptionTitle',
        defaultMessage: 'Frumútgáfa',
        description: 'Card type first edition option title',
      },
      firstEditionOptionSubTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.firstEditionOptionSubTitle',
        defaultMessage:
          '(á einnig við þegar gefið er út kort í stað erlends korts)',
        description: 'Card type first edition option sub title',
      },
      reissueOptionTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.reissueOptionTitle',
        defaultMessage: 'Endurútgáfa',
        description: 'Card type reissue option title',
      },
      reissueOptionSubTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.reissueOptionSubTitle',
        defaultMessage: '(Kortið hefur týnst, eyðilagst eða verið stolið)',
        description: 'Card type reissue option sub title',
      },
      renewalOptionTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.renewalOptionTitle',
        defaultMessage: 'Endurnýjun',
        description: 'Card type renewal option title',
      },
      renewalOptionSubTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.renewalOptionSubTitle',
        defaultMessage: '(Gildistími korts rennur út)',
        description: 'Card type renewal option title',
      },
      reprintOptionTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.reprintOptionTitle',
        defaultMessage: 'Endurrit',
        description: 'Card type reprint option title',
      },
      reprintOptionSubTitle: {
        id: 'ta.dtdc.application:cardType.labels.cardType.reprintOptionSubTitle',
        defaultMessage: '(T.d. vegna nafnabreytingar)',
        description: 'Card type reprint option sub title',
      },
    }),
  },
}
