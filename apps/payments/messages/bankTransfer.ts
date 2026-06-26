import { defineMessages } from 'react-intl'

export const bankTransfer = defineMessages({
  paymentMethodTitle: {
    id: 'payments:bankTransfer.title',
    defaultMessage: 'Millifærsla',
    description: 'Title for bank transfer payment method',
  },
  disclaimer: {
    id: 'payments:bankTransfer.disclaimer',
    defaultMessage:
      'Borgaðu á öruggan og einfaldan hátt beint úr bankaappinu þínu',
    description: 'Disclaimer banner shown on the bank-transfer payment view',
  },
  confirm: {
    id: 'payments:bankTransfer.confirm',
    defaultMessage: 'Hefja millifærslu',
    description: 'Primary button label that initiates the bank-transfer flow',
  },
  accountNumber: {
    id: 'payments:bankTransfer.accountNumber',
    defaultMessage: 'Úttektarreikningur',
    description: 'Label for the payer bank account number (BBAN) input',
  },
  accountNumberPlaceholder: {
    id: 'payments:bankTransfer.accountNumberPlaceholder',
    defaultMessage: '0000-00-000000',
    description:
      'Placeholder for the bank account number input (XXXX-XX-XXXXXX)',
  },
  accountNumberRequired: {
    id: 'payments:bankTransfer.accountNumberRequired',
    defaultMessage: 'Úttektarreikningur er nauðsynlegur',
    description: 'Validation error when the bank account number is empty',
  },
  accountNumberInvalid: {
    id: 'payments:bankTransfer.accountNumberInvalid',
    defaultMessage: 'Sláðu inn gilt reikningsnúmer (0000-00-000000)',
    description:
      'Validation error when the bank account number is not 12 digits',
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
  finishInBankApp: {
    id: 'payments:bankTransfer.finishInBankApp',
    defaultMessage: 'Kláraðu greiðsluna í bankaappinu þínu',
    description:
      'Waiting-screen status when there is no SCA redirect (back-channel) — payer finishes the payment in their bank app. EN: "Finish the payment with your bank app"',
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
  failedToCreate: {
    id: 'payments:bankTransferError.failedToCreate',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að hefja millifærslu. Vinsamlegast reynið aftur.',
    description:
      'Error shown when creating/initiating the bank transfer fails (e.g. provider rejected the create request)',
  },
  failedToCreateTitle: {
    id: 'payments:bankTransferError.failedToCreateTitle',
    defaultMessage: 'Ekki tókst að hefja millifærslu',
    description:
      'Header on the error view when creating/initiating the bank transfer fails',
  },
  missingAccountNumber: {
    id: 'payments:bankTransferError.missingAccountNumber',
    defaultMessage: 'Sláðu inn úttektarreikning til að hefja millifærslu.',
    description:
      'Error shown when the bank transfer is submitted without an account number',
  },
  missingAccountNumberTitle: {
    id: 'payments:bankTransferError.missingAccountNumberTitle',
    defaultMessage: 'Úttektarreikning vantar',
    description:
      'Header on the error view when the bank account number is missing',
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
    defaultMessage: 'Millifærslu hafnað',
    description:
      'Header on the standard error view for a bank-transfer rejected by the bank (REJECTED status)',
  },
  cancelled: {
    id: 'payments:bankTransferError.cancelled',
    defaultMessage: 'Hætt var við millifærslu',
    description: 'Error shown when the bank-transfer attempt was cancelled',
  },
  cancelledTitle: {
    id: 'payments:bankTransferError.cancelledTitle',
    defaultMessage: 'Millifærsla afturkölluð',
    description:
      'Header on the standard error view for a bank-transfer cancelled by the user (CANCELLED status)',
  },
  expired: {
    id: 'payments:bankTransferError.expired',
    defaultMessage:
      'Tími til að ljúka millifærslunni rann út. Reyndu aftur til að halda áfram.',
    description:
      'Error shown when the bank-transfer attempt timed out before completing',
  },
  expiredTitle: {
    id: 'payments:bankTransferError.expiredTitle',
    defaultMessage: 'Millifærsla rann út á tíma',
    description:
      'Header on the standard error view for a bank-transfer that expired before completing',
  },
})
