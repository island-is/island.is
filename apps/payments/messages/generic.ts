import { defineMessages } from 'react-intl'

export const generic = defineMessages({
  buttonCancel: {
    id: 'payments:generic.buttonCancel',
    defaultMessage: 'Hætta við',
    description: 'Cancel',
  },
  buttonFinishAndReturn: {
    id: 'payments:generic.buttonFinishAndReturn',
    defaultMessage: 'Ljúka',
    description: 'Finish',
  },
  footerHelp: {
    id: 'payments:generic.footerHelp',
    defaultMessage: 'Aðstoð',
    description: 'FAQ',
  },
  footerLocaleIS: {
    id: 'payments:generic.footerLocaleIS',
    defaultMessage: 'Íslenska',
    description: 'Icelandic',
  },
  footerLocaleEN: {
    id: 'payments:generic.footerLocaleEN',
    defaultMessage: 'English',
    description: 'English',
  },
  back: {
    id: 'payments:generic.back',
    defaultMessage: 'Til baka',
    description: 'Back',
  },
  product: {
    id: 'payments:generic.product',
    defaultMessage: 'Vara',
    description: 'Product',
  },
  amount: {
    id: 'payments:generic.amount',
    defaultMessage: 'Upphæð',
    description: 'Amount',
  },
  paidAt: {
    id: 'payments:generic.paidAt',
    defaultMessage: 'Greiðslutími',
    description: 'Paid at',
  },
  nationalId: {
    id: 'payments:generic.nationalId',
    defaultMessage: 'Kennitala',
    description: 'National id',
  },
  name: {
    id: 'payments:generic.name',
    defaultMessage: 'Nafn',
    description: 'Name',
  },
  toggleLanguageToEnglish: {
    id: 'payments:generic.toggleLanguageToEnglish',
    defaultMessage: 'Skipta yfir á ensku',
    description: 'Switch to English',
  },
  toggleLanguageToIcelandic: {
    id: 'payments:generic.toggleLanguageToIcelandic',
    defaultMessage: 'Skipta yfir á íslensku',
    description: 'Switch to Icelandic',
  },
})

export const genericError = defineMessages({
  title: {
    id: 'payments:genericError.title',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  description: {
    id: 'payments:genericError.description',
    defaultMessage: 'Vinsamlegast reynið aftur',
    description: 'Please try again',
  },
  fetchFailedTitle: {
    id: 'payments:generic.fetchFailedTitle',
    defaultMessage: 'Greiðsluflæði fannst ekki',
    description: 'Failed to fetch data for flow',
  },
  fetchFailed: {
    id: 'payments:generic.fetchFailed',
    defaultMessage: '[Lengri skýring um hvað fór úrskeiðis]',
    description: 'Failed to fetch data for flow',
  },
  genericError: {
    id: 'payments:generic.genericError',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  buttonTryAgain: {
    id: 'payments:generic.buttonTryAgain',
    defaultMessage: 'Reyna aftur',
    description: 'Try again',
  },
  alreadyPaidTitle: {
    id: 'payments:generic.alreadyPaidTitle',
    defaultMessage: 'Greiðsla þegar framkvæmd',
    description: 'Payment already made',
  },
  alreadyPaid: {
    id: 'payments:generic.alreadyPaid',
    defaultMessage: 'Það er nú þegar búið að greiða fyrir þessa vöru',
    description: 'Payment already made',
  },
  amountMismatchTitle: {
    id: 'payments:generic.amountMismatchTitle',
    defaultMessage: 'Upphæð ekki rétt',
    description: 'Amount mismatch',
  },
  amountMismatch: {
    id: 'payments:generic.amountMismatch',
    defaultMessage: 'Upphæðin sem þú reyndir að greiða er ekki rétt',
    description: 'Amount mismatch',
  },
})

export const debtPayment = defineMessages({
  productTitle: {
    id: 'payments:debtPayment.productTitle',
    defaultMessage: 'Greiðsla skulda',
    description: 'Payment of debts',
  },
})

export const debtError = defineMessages({
  closedTitle: {
    id: 'payments:debtError.closedTitle',
    defaultMessage: 'Skuldastaðan hefur breyst',
    description: 'Your debt status has changed',
  },
  closed: {
    id: 'payments:debtError.closed',
    defaultMessage:
      'Ekki var hægt að ljúka greiðslunni þar sem skuldastaðan hefur breyst. Engin greiðsla var tekin eða hún hefur verið endurgreidd. Vinsamlegast byrjaðu aftur.',
    description:
      'The payment could not be completed because your debt status has changed. No payment was taken, or it has been refunded. Please start again.',
  },
  invalidTitle: {
    id: 'payments:debtError.invalidTitle',
    defaultMessage: 'Ekki er hægt að greiða skuldirnar',
    description: 'The debts cannot be paid',
  },
  invalid: {
    id: 'payments:debtError.invalid',
    defaultMessage:
      'Skuldastaðan hefur breyst eða ekki er hægt að greiða þessar skuldir. Engin greiðsla var tekin. Vinsamlegast byrjaðu aftur.',
    description:
      'Your debt status has changed or these debts cannot be paid. No payment was taken. Please start again.',
  },
  methodNotAllowedTitle: {
    id: 'payments:debtError.methodNotAllowedTitle',
    defaultMessage: 'Greiðsluleið ekki í boði',
    description: 'Payment method not available',
  },
  methodNotAllowed: {
    id: 'payments:debtError.methodNotAllowed',
    defaultMessage:
      'Þessi greiðsluleið er ekki í boði fyrir þessar skuldir. Vinsamlegast veldu aðra greiðsluleið.',
    description:
      'This payment method is not available for these debts. Please choose another payment method.',
  },
  rejectedTitle: {
    id: 'payments:debtError.rejectedTitle',
    defaultMessage: 'Greiðslan var ekki samþykkt',
    description: 'The payment was not accepted',
  },
  rejected: {
    id: 'payments:debtError.rejected',
    defaultMessage:
      'Fjársýslan hafnaði greiðslunni þar sem skuldastaðan hefur breyst. Kortagreiðsla hefur verið endurgreidd. Vinsamlegast byrjaðu aftur.',
    description:
      'The payment was rejected because your debt status has changed. A card payment has been refunded. Please start again.',
  },
})
