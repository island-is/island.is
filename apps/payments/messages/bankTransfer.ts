import { defineMessages } from 'react-intl'

export const bankTransfer = defineMessages({
  paymentMethodTitle: {
    id: 'payments:bankTransfer.title',
    defaultMessage: 'Tafarlaus millifærsla',
    description: 'Title for bank transfer payment method',
  },
  disclaimer: {
    id: 'payments:bankTransfer.disclaimer',
    defaultMessage:
      'Borgaðu á öruggan og einfaldan hátt með tafarlausri millifærslu beint úr bankaappinu þínu',
    description: 'Disclaimer banner shown on the bank-transfer payment view',
  },
  confirm: {
    id: 'payments:bankTransfer.confirm',
    defaultMessage: 'Hefja millifærslu',
    description: 'Primary button label that initiates the bank-transfer flow',
  },
  cancel: {
    id: 'payments:bankTransfer.cancel',
    defaultMessage: 'Hætta við',
    description: 'Cancel-button label on the bank-transfer payment view',
  },
  waiting: {
    id: 'payments:bankTransfer.waiting',
    defaultMessage: 'Beðið eftir staðfestingu frá bankanum',
    description:
      'Single status string shown while the user completes SCA and we poll for terminal status',
  },
})

export const bankTransferSuccess = defineMessages({
  title: {
    id: 'payments:bankTransferSuccess.title',
    defaultMessage: 'Millifærsla tókst',
    description: 'Success message after a completed bank transfer',
  },
})

export const bankTransferError = defineMessages({
  generic: {
    id: 'payments:bankTransferError.generic',
    defaultMessage: 'Millifærsla mistókst',
    description: 'Generic error after a failed bank transfer',
  },
  rejected: {
    id: 'payments:bankTransferError.rejected',
    defaultMessage: 'Bankinn hafnaði millifærslunni',
    description: 'Error shown when the bank rejected the transfer',
  },
  cancelled: {
    id: 'payments:bankTransferError.cancelled',
    defaultMessage: 'Millifærslan var afturkölluð',
    description: 'Error shown when the bank-transfer attempt was cancelled',
  },
})
