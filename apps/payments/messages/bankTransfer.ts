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
  bank: {
    id: 'payments:bankTransfer.bank',
    defaultMessage: 'Banki',
    description:
      'Label for the bank part (first 4 digits) of the payer bank account number. EN: "Bank"',
  },
  ledger: {
    id: 'payments:bankTransfer.ledger',
    defaultMessage: 'Höfuðbók',
    description:
      'Label for the ledger part (middle 2 digits) of the payer bank account number. EN: "Ledger"',
  },
  account: {
    id: 'payments:bankTransfer.account',
    defaultMessage: 'Bankareikningur',
    description:
      'Label for the account part (last 6 digits) of the payer bank account number. EN: "Account number"',
  },
  accountNumberRequired: {
    id: 'payments:bankTransfer.accountNumberRequired',
    defaultMessage: 'Úttektarreikningur er nauðsynlegur',
    description: 'Validation error when the bank account number is empty',
  },
  accountNumberBankNotSupported: {
    id: 'payments:bankTransfer.accountNumberBankNotSupported',
    defaultMessage:
      'Millifærsla er ekki í boði frá þessum banka. Notaðu reikning í öðrum banka.',
    description:
      'Validation error when the account number is well-formed but belongs to a bank the payment provider cannot process. Must not read as a typo error — the number is fine, the bank is the problem. EN: "Bank transfer is not available from this bank. Please use an account at another bank."',
  },
  companyPayerInfo: {
    id: 'payments:bankTransfer.companyPayerInfo',
    defaultMessage:
      'Þú greiðir fyrir hönd <b>{companyName}.</b> Notaðu bankareikning fyrirtækisins, ekki þinn eigin.',
    description:
      'Info banner shown instead of the disclaimer when the payer is a company. {companyName} is the company name without a trailing period; <b> marks it bold. EN: "You are paying on behalf of <b>{companyName}.</b> Use the company\'s bank account, not your own."',
  },
  actorNationalId: {
    id: 'payments:bankTransfer.actorNationalId',
    defaultMessage: 'Kennitala samþykktaraðila',
    description:
      'Label for the national id of the individual who authorises the transfer on behalf of a company payer. EN: "National id of approver"',
  },
  actorNationalIdTooltip: {
    id: 'payments:bankTransfer.actorNationalIdTooltip',
    defaultMessage:
      'Kennitala einstaklings sem hefur heimild til að framkvæma greiðslur af bankareikningi fyrirtækisins.',
    description:
      'Tooltip on the approver national id input. EN: "National id of an individual who is authorised to make payments from the company\'s bank account."',
  },
  actorNationalIdPlaceholder: {
    id: 'payments:bankTransfer.actorNationalIdPlaceholder',
    defaultMessage: '000000-0000',
    description: 'Placeholder for the approver national id input',
  },
  actorNationalIdRequired: {
    id: 'payments:bankTransfer.actorNationalIdRequired',
    defaultMessage: 'Kennitala samþykktaraðila er nauðsynleg.',
    description: 'Validation error when the approver national id is empty',
  },
  actorNationalIdInvalid: {
    id: 'payments:bankTransfer.actorNationalIdInvalid',
    defaultMessage: 'Sláðu inn gilda kennitölu einstaklings.',
    description:
      'Validation error when the approver national id is not a valid national id of an individual (e.g. a company). EN: "Enter a valid national id of an individual."',
  },
  companyNationalId: {
    id: 'payments:bankTransfer.companyNationalId',
    defaultMessage: 'Kennitala {companyName}',
    description:
      'Label for the read-only national id of the company paying. {companyName} is the company name. EN: "National id of {companyName}"',
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
  cancelInBankAppNote: {
    id: 'payments:bankTransfer.cancelInBankAppNote',
    defaultMessage: 'Þú getur hafnað greiðslubeiðninni í bankaappinu þínu.',
    description:
      'Static note under the SCA QR / open-banking-app screen telling the payer how to back out, since the payment cannot be cancelled from here once SCA is under way. EN: "Changed your mind? You can decline the payment request in your banking app."',
  },
  scanQrInstruction: {
    id: 'payments:bankTransfer.scanQrInstruction',
    defaultMessage: 'Skannaðu þennan QR-kóða með símanum þínum.',
    description:
      'Bold heading under the SCA QR code on the desktop pending screen. EN: "Scan the QR code"',
  },
  openBankingApp: {
    id: 'payments:bankTransfer.openBankingApp',
    defaultMessage: 'Opna bankaapp',
    description:
      'Primary CTA on the mobile pending screen that opens the SCA deep link in the banking app. EN: "Open banking app"',
  },
  openBankingAppInstruction: {
    id: 'payments:bankTransfer.openBankingAppInstruction',
    defaultMessage: 'Opnaðu bankaappið þitt til að staðfesta greiðslu.',
    description:
      'Supporting text under the open-banking-app button on the mobile pending screen. EN: "Open your banking app to approve payment."',
  },
  checkPhone: {
    id: 'payments:bankTransfer.checkPhone',
    defaultMessage:
      'Athugaðu hvort tilkynning frá bankanum þínum hafi borist í símann þinn',
    description:
      'Waiting message when SCA is required but there is no SCA URL (back-channel SCA). EN: "Please check your phone for a banking app notification"',
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
      'Tími til að ljúka millifærslunni rann út. Vinsamlegast reynið aftur.',
    description:
      'Error shown when the bank-transfer attempt timed out before completing',
  },
  expiredTitle: {
    id: 'payments:bankTransferError.expiredTitle',
    defaultMessage: 'Tíminn rann út',
    description:
      'Header on the standard error view for a bank-transfer that expired before completing',
  },
})
