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
        'Samkvæmt 11. gr. laga um innheimtu opinberra skatta og gjalda, nr. 150/2019 ber launagreiðanda að draga af launum opinber gjöld utan staðgreiðslu, þ.e. þing- og sveitarsjóðsgjöld. Nánar má lesa um launaafdrátt á ',
      description: 'Employer page description',
    },
    taxHomePageUrl: {
      id: `pdpp.application:application.employer.general.taxHomePageUrl`,
      defaultMessage:
        'https://www.skatturinn.is/innheimta/vanskil/launaafdrattur/',
      description: 'Disposable income tax home page url',
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
      defaultMessage: 'Sláðu inn kennitölu atvinnurekanda',
      description: 'Employer national id',
    },
    employerNationalIdPlaceholder: {
      id: `pdpp.application:application.employer.labels.employerNationalIdPlaceholder`,
      defaultMessage: 'Kennitala launagreiðanda',
      description: 'Employer national id placeholder',
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
      Í sjálfsafgreiðsluferlinu er miðað við að lágmarksgreiðsla á skuld sé {percent} af ráðstöfunartekjum þínum. Ef þú telur þessa fjárhæð of háa miðað við framfærslukostnað þinn þá skaltu hafa samband við innheimtumann ríkissjóðs. 
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
      defaultMessage: `Lágmarksgreiðsla í launaafdrætti er {minPayment}`,
      description: 'Disposable income alert message',
    },
  }),
}
