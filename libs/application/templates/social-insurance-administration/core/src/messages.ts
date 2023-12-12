import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'sia.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'sia.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'sia.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  noEmailFound: {
    id: 'sia.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'sia.application:error.no.email.found.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það [hér](https://minarsidur.tr.is/min-sida) og komdu svo aftur til að sækja um.',
    description: 'english translation',
  },
  iban: {
    id: 'sia.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'sia.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
})
