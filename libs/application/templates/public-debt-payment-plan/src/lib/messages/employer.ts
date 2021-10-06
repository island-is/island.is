import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const employer = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:application.employer.general.pageTitle`,
      defaultMessage: 'Upplýsingar um launagreiðanda',
      description: 'Employer page title',
    },
    pageDescription: {
      id: `pdpp.application:application.employer.general.pageDescription`,
      defaultMessage:
        'Upplýsingar um tekjur eru sóttar í staðgreiðsluskrá Skattsins. Ráðstöfunartekjur eru reiknaðar með því að draga frá staðgreiðslu opinberra gjalda, iðgjöld í lífeyrissjóði og meðlagsgreiðslur sem eru dregnar frá launum. ',
      description: 'Employer page description',
    },
    disposableIncomePageTitle: {
      id: `pdpp.application:application.employer.general.disposableIncomePageTitle`,
      defaultMessage: 'Ráðstöfunartekjur',
      description: 'Disposable Income page title',
    },
    disposableIncomePageDescription: {
      id: `pdpp.application:application.employer.general.disposableIncomePageDescription`,
      defaultMessage:
        'Upplýsingar um ráðstöfunartekjur eru sóttar til Skattsins og er reiknuð með tilliti til launafjárhæðar, staðgreiðslu, lífeyrissjóðs- og meðlagsgreiðslna.',
      description: 'Disposable Income page description',
    },
  }),
  labels: defineMessages({
    taxHomePage: {
      id: `pdpp.application:application.employer.labels.taxHomePage`,
      defaultMessage: 'heimasíðu Skattsins',
      description: 'Employer tax home page link label',
    },
    employerIsCorrect: {
      id: `pdpp.application:application.employer.labels.employerIsCorrect`,
      defaultMessage: 'Er minn vinnuveitandi',
      description: 'Employer is correct label',
    },
    employerIsNotCorrect: {
      id: `pdpp.application:application.employer.labels.employerIsNotCorrect`,
      defaultMessage: 'Er ekki minn vinnuveitandi',
      description: 'Employer is not correct label',
    },
    employerNationalIdLabel: {
      id: `pdpp.application:application.employer.labels.employerNationalIdLabel`,
      defaultMessage:
        'Vinsamlegast fylltu út réttar upplýsingar um vinnuveitanda',
      description: 'Employer national id label',
    },
    employerNationalId: {
      id: `pdpp.application:application.employer.labels.employerNationalId`,
      defaultMessage: 'Kennitala fyrirtækisins',
      description: 'Employer national id',
    },
    yourDisposableIncome: {
      id: `pdpp.application:application.employer.labels.yourDisposableIncome`,
      defaultMessage: 'Eru þínar ráðstöfunartekjur á mánuði.',
      description: 'Is your disposable income in a month',
    },
    yourMinimumPayment: {
      id: `pdpp.application:application.employer.labels.yourMinimumPayment`,
      defaultMessage: 'Er þín lágmarksgreiðsla á mánuði.',
      description: 'Is your minimum payment in a month',
    },
    minimumMonthlyPayment: {
      id: `pdpp.application:application.employer.labels.minimumMonthlyPayment`,
      defaultMessage: 'Lágmarksgreiðsla á mánuði',
      description: 'Minimum monthly payment title',
    },
    minimumMonthlyPaymentDescription: {
      id: `pdpp.application:application.employer.labels.minimumMonthlyPaymentDescription`,
      defaultMessage: `
      Í sjálfsafgreiðsluferlinu er miðað við lágmarksgreiðsla á skuld sé 10% af ráðstöfunartekjum þínum. Ef þú telur þessa fjárhæð of háa miðað við framfærslukostnað þinn þá skaltu hafa samband við innheimtumann ríkissjóð. 
      `,
      description: 'Minimum monthly payment description',
    },
    alertTitle: {
      id: `pdpp.application:application.employer.labels.alertTitle`,
      defaultMessage: `Athugið`,
      description: 'Disposable income alert message title',
    },
    alertMessage: {
      id: `pdpp.application:application.employer.labels.alertMessage`,
      defaultMessage: `Lágmarksgreiðsla í launaafdrætti er {minPayment} og þegar áætlun um launaafdrátt er gerð þá er hægt að fara niður í {minPayment} greiðslu.`,
      description: 'Disposable income alert message',
    },
  }),
}
