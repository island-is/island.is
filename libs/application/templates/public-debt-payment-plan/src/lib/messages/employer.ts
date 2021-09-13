import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const employer = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:application.employer.pageTitle`,
      defaultMessage: 'Upplýsingar um launagreiðanda',
      description: 'Employer page title',
    },
    pageDescription: {
      id: `pdpp.application:application.employer.pageDescription`,
      defaultMessage:
        'Samkvæmt 11. gr. laga um innheimtu opinberra skatta og gjalda, nr. 150/2019 ber launagreiðanda að draga af launum opinber gjöld utan staðgreiðslu, þ.e. þing- og sveitarsjóðsgjöld. Nánar má lesa um launaafdrátt á ',
      description: 'Employer page description',
    },
    disposableIncomePageTitle: {
      id: `pdpp.application:application.employer.disposableIncomePageTitle`,
      defaultMessage: 'Ráðstöfunartekjur',
      description: 'Disposable Income page title',
    },
    disposableIncomePageDescription: {
      id: `pdpp.application:application.employer.disposableIncomePageDescription`,
      defaultMessage:
        'Upplýsingar um ráðstöfunartekjur eru sóttar til Skattsins og er reiknuð með tilliti til launafjárhæðar, staðgreiðslu, lífeyrissjóðs- og meðlagsgreiðslna.',
      description: 'Disposable Income page description',
    },
  }),
  labels: defineMessages({
    taxHomePage: {
      id: `pdpp.application:application.employer.taxHomePage`,
      defaultMessage: 'heimasíðu Skattsins',
      description: 'Employer tax home page link label',
    },
    employerIsCorrect: {
      id: `pdpp.application:application.employer.employerIsCorrect`,
      defaultMessage: 'Er minn vinnuveitandi',
      description: 'Employer is correct label',
    },
    employerIsNotCorrect: {
      id: `pdpp.application:application.employer.employerIsNotCorrect`,
      defaultMessage: 'Er ekki minn vinnuveitandi',
      description: 'Employer is not correct label',
    },
    employerNationalIdLabel: {
      id: `pdpp.application:application.employer.employerNationalIdLabel`,
      defaultMessage:
        'Vinsamlegast fylltu út réttar upplýsingar um vinnuveitanda',
      description: 'Employer national id label',
    },
    employerNationalId: {
      id: `pdpp.application:application.employer.employerNationalId`,
      defaultMessage: 'Kennitala fyrirtækisins',
      description: 'Employer national id',
    },
    yourDisposableIncome: {
      id: `pdpp.application:application.employer.yourDisposableIncome`,
      defaultMessage: 'Eru þínar ráðstöfunartekjur á mánuði.',
      description: 'Is your disposable income in a month',
    },
    yourMinimumPayment: {
      id: `pdpp.application:application.employer.yourMinimumPayment`,
      defaultMessage: 'Er þín lágmarksgreiðsla á mánuði.',
      description: 'Is your minimum payment in a month',
    },
    minimumMonthlyPayment: {
      id: `pdpp.application:application.employer.minimumMonthlyPayment`,
      defaultMessage: 'Lágmarksgreiðsla á mánuði',
      description: 'Minimum monthly payment title',
    },
    minimumMonthlyPaymentDescription: {
      id: `pdpp.application:application.employer.minimumMonthlyPaymentDescription`,
      defaultMessage: `
        Lágmarksgreiðsla skuldar á mánuði eru 10% af ráðstöfunartekjum þínum.
        Þetta á við hvort sem um er að ræða eina eða fleiri skuld.
      `,
      description: 'Minimum monthly payment description',
    },
  }),
}
