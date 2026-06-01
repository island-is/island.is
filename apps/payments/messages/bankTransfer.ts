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
  continuePayment: {
    id: 'payments:bankTransfer.continuePayment',
    defaultMessage: 'Halda áfram með greiðslu',
    description:
      'Primary CTA on the pending screen — resumes the in-flight bank-transfer attempt by redirecting back to the provider SCA URL',
  },
  cancelFailedToast: {
    id: 'payments:bankTransfer.cancelFailedToast',
    defaultMessage: 'Ekki tókst að hætta við millifærsluna. Reyndu aftur.',
    description:
      'Error toast shown when the cancel-bank-transfer mutation fails (non-already-paid)',
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
  genericTitle: {
    id: 'payments:bankTransferError.genericTitle',
    defaultMessage: 'Millifærsla mistókst',
    description:
      'Header on the standard error view for a generic bank-transfer failure (ERROR status)',
  },
  rejected: {
    id: 'payments:bankTransferError.rejected',
    defaultMessage: 'Bankinn hafnaði millifærslunni',
    description: 'Error shown when the bank rejected the transfer',
  },
  rejectedTitle: {
    id: 'payments:bankTransferError.rejectedTitle',
    defaultMessage: 'Millifærslunni hafnað',
    description:
      'Header on the standard error view for a bank-transfer rejected by the bank (REJECTED status)',
  },
  cancelled: {
    id: 'payments:bankTransferError.cancelled',
    defaultMessage: 'Millifærslan var afturkölluð',
    description: 'Error shown when the bank-transfer attempt was cancelled',
  },
  cancelledTitle: {
    id: 'payments:bankTransferError.cancelledTitle',
    defaultMessage: 'Millifærsla afturkölluð',
    description:
      'Header on the standard error view for a bank-transfer cancelled by the user (CANCELLED status)',
  },
})
