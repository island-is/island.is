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
