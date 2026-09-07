import { defineMessages } from 'react-intl'

export const threeDSecure = defineMessages({
  title: {
    id: 'payments:threeDSecure.title',
    defaultMessage: 'Auðkenning tókst',
    description: '3DS was successful',
  },
  pleaseWait: {
    id: 'payments:threeDSecure.pleaseWait',
    defaultMessage: 'Hinkraðu á meðan við klárum greiðslu',
    description: 'Please wait while we finish the payment',
  },
  failedTitle: {
    id: 'payments:threeDSecure.failedTitle',
    defaultMessage: 'Greiðslan tókst ekki',
    description: 'Shown when the card payment / 3DS step did not complete',
  },
  failedMessage: {
    id: 'payments:threeDSecure.failedMessage',
    defaultMessage:
      'Ekki tókst að ljúka greiðslunni. Reyndu aftur eða veldu annan greiðslumáta.',
    description: 'Shown in the 3DS iframe when the payment did not complete',
  },
})
