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
  doNotOwe: defineMessages({
    title: {
      id: `pdpp.application:errorModal.doNotOwe.title`,
      defaultMessage: 'Ekki skilvís með fyrri greiðsluáætlanir',
      description: 'Error Modal: Do not owe title',
    },
    summary: {
      id: `pdpp.application:errorModal.doNotOwe.summary`,
      defaultMessage:
        'Ekki er hægt að gera greiðsluáætlun Í sjálfsafgreiðslu þar sem þú hefur ekki staðið við fyrri greiðsluáætlanir. Vinsamlegast hafðu samband við innheimtumann í þínu umdæmi til að fá frekari upplýsingar og úrlausn.',
      description: 'Error Modal: Do not owe summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.doNotOwe.linkOne`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/greidsluaaetlanir/',
      description: 'Error Modal: Do not owe link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.doNotOwe.linkOneName`,
      defaultMessage: 'Skattar',
      description: 'Error Modal: Do not owe name of link one',
    },
    linkTwo: {
      id: `pdpp.application:errorModal.doNotOwe.linkTwo`,
      defaultMessage: 'https://island.is/s/syslumenn/nordurland-vestra',
      description: 'Error Modal: Do not owe link two',
    },
    linkTwoName: {
      id: `pdpp.application:errorModal.doNotOwe.linkTwoName`,
      defaultMessage: 'Sektir, sakarkostnaður og ofgreiddar bætur',
      description: 'Error Modal: Do not owe name of link two',
    },
  }),
  other: defineMessages({
    title: {
      id: `pdpp.application:errorModal.other.title`,
      defaultMessage:
        'Gjaldflokkar sem falla ekki undir rafræna greiðsluáætlun',
      description: 'Error Modal: other title',
    },
    summary: {
      id: `pdpp.application:errorModal.other.summary`,
      defaultMessage:
        'Í sjálfsafgreiðslu er ekki er heimilt að gera greiðsluáætlun um þessi gjöld. Vinsamlegast hafðu samband við innheimtumann í þínu umdæmi til að fá frekari upplýsingar og úrlausn.',
      description: 'Error Modal: other summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.other.linkOne`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/greidsluaaetlanir/',
      description: 'Error Modal: other link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.other.linkOneName`,
      defaultMessage: 'Skattar',
      description: 'Error Modal: other name of link one',
    },
    linkTwo: {
      id: `pdpp.application:errorModal.other.linkTwo`,
      defaultMessage: 'https://island.is/s/syslumenn/nordurland-vestra',
      description: 'Error Modal: other link two',
    },
    linkTwoName: {
      id: `pdpp.application:errorModal.other.linkTwoName`,
      defaultMessage: 'Sektir, sakarkostnaður og ofgreiddar bætur',
      description: 'Error Modal: other name of link two',
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
  noDebts: defineMessages({
    title: {
      id: `pdpp.application:errorModal.noDebts.title`,
      defaultMessage: 'Engar ógreiddar kröfur',
      description: 'Error Modal: Debts title',
    },
    summary: {
      id: `pdpp.application:errorModal.noDebts.summary`,
      defaultMessage: `Engar ógreiddar kröfur fundust á þinni kennitölu sem hægt er að gera greiðsluáætlun um í sjálfsafgreiðslu.
        Vinsamlegast hafðu samband við innheimtumenn ríkissjóðs fyrir frekari upplýsingar.`,
      description: 'Error Modal: Debts summary',
    },
    linkOne: {
      id: `pdpp.application:errorModal.noDebts.linkOne`,
      defaultMessage: 'https://island.is/minarsidur/fjarmal/stada',
      description: 'Error Modal: Debts link one',
    },
    linkOneName: {
      id: `pdpp.application:errorModal.noDebts.linkOneName`,
      defaultMessage: 'Skoða fjármál á mínum síðum island.is',
      description: 'Error Modal: Debts name of link one',
    },
  }),
}
