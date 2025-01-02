import { defineMessages } from 'react-intl'

export const generic = defineMessages({
  buttonCancel: {
    id: 'payments.generic:buttonCancel',
    defaultMessage: 'Hætta við',
    description: 'Cancel',
  },
  footerHelp: {
    id: 'payments.generic:footerHelp',
    defaultMessage: 'Aðstoð',
    description: 'FAQ',
  },
  footerLocaleIS: {
    id: 'payments.generic:footerLocaleIS',
    defaultMessage: 'Íslenska',
    description: 'Icelandic',
  },
  footerLocaleEN: {
    id: 'payments.generic:footerLocaleEN',
    defaultMessage: 'English',
    description: 'English',
  },
  back: {
    id: 'payments.generic:back',
    defaultMessage: 'Til baka',
    description: 'Back',
  },
})

export const genericError = defineMessages({
  title: {
    id: 'payments.genericError:title',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  description: {
    id: 'payments.genericError:description',
    defaultMessage: 'Vinsamlegast reynið aftur',
    description: 'Please try again',
  },
  fetchFailedTitle: {
    id: 'payments.generic:fetchFailedTitle',
    defaultMessage: 'Greiðsluflæði fannst ekki',
    description: 'Failed to fetch data for flow',
  },
  fetchFailed: {
    id: 'payments.generic:fetchFailed',
    defaultMessage: '[Lengri skýring um hvað fór úrskeiðis]',
    description: 'Failed to fetch data for flow',
  },
  genericError: {
    id: 'payments.generic:genericError',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  buttonTryAgain: {
    id: 'payments.generic:buttonTryAgain',
    defaultMessage: 'Reyna aftur',
    description: 'Try again',
  },
})
