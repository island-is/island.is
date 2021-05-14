import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const employer = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:application.employer.pageTitle`,
      defaultMessage: 'Upplýsingar um launagreiðanda',
      description: 'Employer page title',
    },
    pageDescription: {
      id: `${t}:application.employer.pageDescription`,
      defaultMessage:
        'Skv. lögum ber launagreiðanda að draga af launum opinber gjöld utan staðgreiðslu, þ.e. þing- og sveitarsjóðsgjöld. Nánar má lesa um launaafdrátt á ',
      description: 'Employer page description',
    },
    disposableIncomePageTitle: {
      id: `${t}:application.employer.disposableIncomePageTitle`,
      defaultMessage: 'Ráðstöfunartekjur',
      description: 'Disposable Income page title',
    },
    disposableIncomePageDescription: {
      id: `${t}:application.employer.disposableIncomePageDescription`,
      defaultMessage:
        'Upplýsingar um ráðstöfunartekjur eru sóttar til Skattsins og er reiknuð með tilliti til launafjárhæðar, staðgreiðslu, lífeyrissjóðs- og meðlagsgreiðslna.',
      description: 'Disposable Income page description',
    },
  }),
  labels: defineMessages({
    taxHomePage: {
      id: `${t}:application.employer.taxHomePage`,
      defaultMessage: 'heimasíðu skattsins',
      description: 'Employer tax home page link label',
    },
    employerIsCorrect: {
      id: `${t}:application.employer.employerIsCorrect`,
      defaultMessage: 'Þetta er réttur vinnuveitandi',
      description: 'Employer is correct label',
    },
    employerIsNotCorrect: {
      id: `${t}:application.employer.employerIsNotCorrect`,
      defaultMessage: 'Nei þetta er ekki réttur vinnuveitandi',
      description: 'Employer is not correct label',
    },
    employerNationalIdLabel: {
      id: `${t}:application.employer.employerNationalIdLabel`,
      defaultMessage:
        'Vinsamlegast fylltu út réttar upplýsingar um vinnuveitanda',
      description: 'Employer national id label',
    },
    employerNationalId: {
      id: `${t}:application.employer.employerNationalId`,
      defaultMessage: 'Kennitala fyrirtækisins',
      description: 'Employer national id',
    },
    yourDisposableIncome: {
      id: `${t}:application.employer.yourDisposableIncome`,
      defaultMessage: 'Eru þínar ráðstöfunartekjur á mánuði.',
      description: 'Is your disposable income in a month',
    },
    yourMinimumPayment: {
      id: `${t}:application.employer.yourMinimumPayment`,
      defaultMessage: 'Er þín lágmarksgreiðsla á mánuði.',
      description: 'Is your minimum payment in a month',
    },
    minimumMonthlyPayment: {
      id: `${t}:application.employer.minimumMonthlyPayment`,
      defaultMessage: 'Lágmarksgreiðsla á mánuði',
      description: 'Minimum monthly payment title',
    },
    minimumMonthlyPaymentDescription: {
      id: `${t}:application.employer.minimumMonthlyPaymentDescription`,
      defaultMessage: `
        Lágmarksgreiðsla skuldar á mánuði eru 10% af ráðstöfunartekjum þínum.
        Þetta á við hvort sem um er að ræða eina eða fleiri skuld.
      `,
      description: 'Minimum monthly payment description',
    },
  }),
}
