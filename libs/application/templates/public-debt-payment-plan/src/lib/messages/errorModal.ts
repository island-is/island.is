import { defineMessages } from 'react-intl'

export const errorModal = {
  labels: defineMessages({
    closeModal: {
      id: `pdpp.application:errorModal.labels.closeModal`,
      defaultMessage: 'Loka umsókn',
      description: 'Close modal button',
    },
  }),
  maxDebtModal: defineMessages({
    title: {
      id: `pdpp.application:errorModal.maxDebtModal.title`,
      defaultMessage: 'Skuld yfir hámarki',
      description: 'Error Modal: Max debt modal title',
    },
    summary: {
      id: `pdpp.application:errorModal.maxDebtModal.summary`,
      defaultMessage:
        'Ekki er hægt að gera greiðsluáætlun í sjálfsafgreiðslu þar sem staða gjalda er yfir hámarki. Vinsamlegast hafðu samband við innheimtumann til að fá frekari upplýsingar og úrlausn.',
      description: 'Error Modal: Max debt modal summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.maxDebtModal.linkOne`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/greidsluaaetlanir/',
      description: 'Error Modal: Max debt modal link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.maxDebtModal.linkOneName`,
      defaultMessage: 'Skattar',
      description: 'Error Modal: Max debt modal name of link one',
    },
    linkTwo: {
      id: `pdpp.application:errorModal.maxDebtModal.linkTwo`,
      defaultMessage: 'https://island.is/s/syslumenn/nordurland-vestra',
      description: 'Error Modal: Max debt modal link two',
    },
    linkTwoName: {
      id: `pdpp.application:errorModal.maxDebtModal.linkTwoName`,
      defaultMessage: 'Sektir, sakarkostnaður og ofgreiddar bætur',
      description: 'Error Modal: Max debt modal name of link two',
    },
  }),
  estimationOfReturns: defineMessages({
    title: {
      id: `pdpp.application:errorModal.estimationOfReturns.title`,
      defaultMessage: 'Áætlun á skilagreinum eða framtölum',
      description: 'Error Modal: Estimation of returns title',
    },
    summary: {
      id: `pdpp.application:errorModal.estimationOfReturns.summary`,
      defaultMessage:
        'Ekki er hægt að gera greiðsluáætlun í sjálfsafgreiðslu vegna áætlana á gjöldum. Vinsamlegast hafðu samband við innheimtumann til að frekari upplýsingar og úrlausn.',
      description: 'Error Modal: Estimation of returns summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.estimationOfReturns.linkOne`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/greidsluaaetlanir/',
      description: 'Error Modal: Estimation of returns link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.estimationOfReturns.linkOneName`,
      defaultMessage: 'Skattar',
      description: 'Error Modal: Estimation of returns name of link one',
    },
    linkTwo: {
      id: `pdpp.application:errorModal.estimationOfReturns.linkTwo`,
      defaultMessage: 'https://island.is/s/syslumenn/nordurland-vestra',
      description: 'Error Modal: Estimation of returns link two',
    },
    linkTwoName: {
      id: `pdpp.application:errorModal.estimationOfReturns.linkTwoName`,
      defaultMessage: 'Sektir, sakarkostnaður og ofgreiddar bætur',
      description: 'Error Modal: Estimation of returns name of link two',
    },
  }),
  defaultPaymentCollection: defineMessages({
    title: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.title`,
      defaultMessage: 'Vanskil',
      description: 'Error Modal: Default payment collection title',
    },
    summary: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.summary`,
      defaultMessage:
        'Ekki er hægt að gera greiðsluáætlun Í sjálfsafgreiðslu þar sem gjöld hafa farið í vanskilainnheimtu. Vinsamlegast hafðu samband við innheimtumann í þínu umdæmi til að fá frekari upplýsingar og úrlausn.',
      description: 'Error Modal: Default payment collection summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.linkOne`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/greidsluaaetlanir/',
      description: 'Error Modal: Default payment collection link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.linkOneName`,
      defaultMessage: 'Skattar',
      description: 'Error Modal: Default payment collection name of link one',
    },
    linkTwo: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.linkTwo`,
      defaultMessage: 'https://island.is/s/syslumenn/nordurland-vestra',
      description: 'Error Modal: Default payment collection link two',
    },
    linkTwoName: {
      id: `pdpp.application:errorModal.defaultPaymentCollection.linkTwoName`,
      defaultMessage: 'Sektir, sakarkostnaður og ofgreiddar bætur',
      description: 'Error Modal: Default payment collection name of link two',
    },
  }),
}
