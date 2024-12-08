import { defineMessages } from 'react-intl'

export const generic = defineMessages({
  buttonCancel: {
    id: 'payments.generic:buttonCancel',
    defaultMessage: 'Hætta við',
    description: 'Cancel',
  },
})

export const genericError = defineMessages({
  fetchFailed: {
    id: 'payments.generic:fetchFailed',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um greiðsluflæði',
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
