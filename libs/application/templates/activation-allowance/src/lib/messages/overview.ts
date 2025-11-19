import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    pageTitle: {
      id: 'aa.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar um virknistyrk',
      description: `Overview title`,
    },
    description: {
      id: 'aa.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp. ',
      description: `Overview description`,
    },
  }),
  labels: defineMessages({
    phoneNumber: {
      id: 'aa.application:overview.labels.phoneNumber',
      defaultMessage: 'Símanúmer: {value}',
      description: 'Phonenumber label for overview information',
    },
    bank: {
      id: 'aa.application:overview.labels.bank',
      defaultMessage: 'Banki: {value}',
      description: 'bank label for overview information',
    },
    contactIsSameAsApplicant: {
      id: 'aa.application:overview.labels.contactIsSameAsApplicant',
      defaultMessage: 'Tengiliður er sá sami og umsækjandi',
      description:
        'contact is same as applicant label for overview information',
    },
    name: {
      id: 'aa.application:overview.labels.name',
      defaultMessage: 'Nafn: {value}',
      description: 'name label for overview information',
    },
    contactConnection: {
      id: 'aa.application:overview.labels.contactConnection',
      defaultMessage: 'Tengsl: {value}',
      description: 'contact connection label for overview information',
    },
    email: {
      id: 'aa.application:overview.labels.email',
      defaultMessage: 'Netfang: {value}',
      description: 'email label for overview information',
    },
    drivingLicenses: {
      id: 'aa.application:overview.labels.drivingLicenses',
      defaultMessage: 'Ökuréttindi: {value}',
      description: 'driving license label for overview information',
    },
    heavyMachineryLicenses: {
      id: 'aa.application:overview.labels.heavyMachineryLicenses',
      defaultMessage: 'Vinnuvélaréttindi: {value}',
      description: 'heavy machinery license label for overview information',
    },
    employer: {
      id: 'aa.application:overview.labels.employer',
      defaultMessage: 'Launagreiðandi: {value}',
      description: 'company label for overview information',
    },
    paymentMonth: {
      id: 'aa.application:overview.labels.paymentMonth',
      defaultMessage: 'Launamánuður: {value}',
      description: 'payment month label for overview information',
    },
    income: {
      id: 'aa.application:overview.labels.income',
      defaultMessage: 'Launatekjur: {value} kr.',
      description: 'income label for overview information',
    },
    incomeHeading: {
      id: 'aa.application:overview.labels.incomeHeading',
      defaultMessage: 'Tekjur {value}',
      description: 'income heading for each income for overview information',
    },
    submitButtonText: {
      id: 'aa.application:overview.labels.submitButtonText',
      defaultMessage: 'Sækja um',
      description: 'Submit button text',
    },
  }),
}
