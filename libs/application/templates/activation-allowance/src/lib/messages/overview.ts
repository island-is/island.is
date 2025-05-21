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
    nationalAddress: {
      id: 'aa.application:overview.labels.nationalAddress',
      defaultMessage: 'Ríkisfang: {value}',
      description: 'National address label for overview information',
    },
    phoneNumber: {
      id: 'aa.application:overview.labels.phoneNumber',
      defaultMessage: 'Sími: {value}',
      description: 'Phonenumber label for overview information',
    },
  }),
}
