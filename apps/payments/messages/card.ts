import { defineMessages } from 'react-intl'

export const card = defineMessages({
  paymentMethodTitle: {
    id: 'payments:card.title',
    defaultMessage: 'Greiðslukort',
    description: 'Title for card payment method',
  },
  cardNumber: {
    id: 'payments:card.cardNumber',
    defaultMessage: 'Kortanúmer',
    description: 'Card number',
  },
  cardNumberPlaceholder: {
    id: 'payments:card.cardNumberPlaceholder',
    defaultMessage: '**** **** **** ****',
    description: 'Card number placeholder',
  },
  cardExpiry: {
    id: 'payments:card.cardExpiry',
    defaultMessage: 'Gildistími',
    description: 'Card expiry',
  },
  cardExpiryPlaceholder: {
    id: 'payments:card.cardExpiryPlaceholder',
    defaultMessage: 'MM/ÁÁ',
    description: 'MM/YY',
  },
  cardCVC: {
    id: 'payments:card.cardCVC',
    defaultMessage: 'CVC',
    description: 'Card CVC',
  },
  cardCVCPlaceholder: {
    id: 'payments:card.cardCVCPlaceholder',
    defaultMessage: '***',
    description: 'Card CVC placeholder',
  },
  pay: {
    id: 'payments:card.pay',
    defaultMessage: 'Greiða',
    description: 'Pay',
  },
})

export const cardSuccess = defineMessages({
  title: {
    id: 'payments:cardSuccess.title',
    defaultMessage: 'Greiðsla tókst',
    description: 'Payment successful',
  },
  subTitle: {
    id: 'payments:cardSuccess.subTitle',
    defaultMessage: 'Kvittun verður send í pósthólfið',
    description: 'Receipt will be sent to your islandis inbox',
  },
})

export const cardValidationError = defineMessages({
  cardNumber: {
    id: 'payments:validationError.card.cardNumberError',
    defaultMessage: 'Kortanúmer er nauðsynlegt',
    description: 'Card number is required',
  },
  invalidCardNumber: {
    id: 'payments:validationError.card.invalidCardNumberError',
    defaultMessage: 'Ógilt kortanúmer',
    description: 'Invalid card number',
  },
  cardNumberTooShort: {
    id: 'payments:validationError.card.cardNumberTooShortError',
    defaultMessage: 'Kortanúmer er of stutt',
    description: 'Card number is too short',
  },
  cardExpiry: {
    id: 'payments:validationError.card.cardExpiryError',
    defaultMessage: 'Gildistími er nauðsynlegur',
    description: 'Card expiry is required',
  },
  cardExpiryExpired: {
    id: 'payments:validationError.card.cardExpiryExpiredError',
    defaultMessage: 'Kort er útrunnið',
    description: 'Card is expired',
  },
  cardExpiryInvalid: {
    id: 'payments:validationError.card.cardExpiryInvalidError',
    defaultMessage: 'Ógildur gildistími',
    description: 'Invalid expiry date',
  },
  cardExpiryInvalidMonth: {
    id: 'payments:validationError.card.cardExpiryInvalidMonth',
    defaultMessage: 'Ógildur mánuður',
    description: 'Invalid expiry date month',
  },
  cardCVC: {
    id: 'payments:validationError.card.cardCVCError',
    defaultMessage: 'Öryggiskóði er nauðsynlegur',
    description: 'Card CVC is required',
  },
  cardCVCTooShort: {
    id: 'payments:validationError.card.cardCVCTooShortError',
    defaultMessage: 'Öryggiskóði er of stuttur',
    description: 'Card CVC is too short',
  },
})

export const cardError = defineMessages({
  insufficientFundsTitle: {
    id: 'payments:cardError.insufficientFundsTitle',
    defaultMessage: 'Ekki heimild',
    description: 'Insufficient funds',
  },
  insufficientFunds: {
    id: 'payments:cardError.insufficientFunds',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ónægrar ráðstöfunar á kortinu',
    description: 'Insufficient funds',
  },
  expiredCardTitle: {
    id: 'payments:cardError.expiredCardTitle',
    defaultMessage: 'Kort útrunnið',
    description: 'Expired card',
  },
  expiredCard: {
    id: 'payments:cardError.expiredCard',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna þess að kortið er útrunnið',
    description: 'Expired card',
  },
  invalidCardNumberTitle: {
    id: 'payments:cardError.invalidCardNumberTitle',
    defaultMessage: 'Ógilt kortanúmer',
    description: 'Invalid card number',
  },
  invalidCardNumber: {
    id: 'payments:cardError.invalidCardNumber',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds kortanúmers',
    description: 'Invalid card number',
  },
  invalidCardExpiryTitle: {
    id: 'payments:cardError.invalidCardExpiryTitle',
    defaultMessage: 'Ógildur gildistími',
    description: 'Invalid expiry date',
  },
  invalidCardExpiry: {
    id: 'payments:cardError.invalidCardExpiry',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds gildistíma',
    description: 'Invalid expiry date',
  },
  invalidCardCVCTitle: {
    id: 'payments:cardError.invalidCardCVCTitle',
    defaultMessage: 'Ógildur öryggiskóði',
    description: 'Invalid CVC',
  },
  invalidCardCVC: {
    id: 'payments:cardError.invalidCardCVC',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds öryggiskóða',
    description: 'Invalid CVC',
  },
  invalidCardTitle: {
    id: 'payments:cardError.invalidCardTitle',
    defaultMessage: 'Ógilt kort',
    description: 'Invalid card',
  },
  invalidCard: {
    id: 'payments:cardError.invalidCard',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds kort',
    description: 'Invalid card',
  },
  lostCardTitle: {
    id: 'payments:cardError.lostCardTitle',
    defaultMessage: 'Týnt kort',
    description: 'Lost card',
  },
  lostCard: {
    id: 'payments:cardError.lostCard',
    defaultMessage:
      'Kortið hefur verið tilkynnt týnt og er lokað. Hafðu samband við kortaútgefanda.',
    description: 'Lost card description',
  },
  stolenCardTitle: {
    id: 'payments:cardError.stolenCardTitle',
    defaultMessage: 'Stolið kort',
    description: 'Stolen card',
  },
  stolenCard: {
    id: 'payments:cardError.stolenCard',
    defaultMessage:
      'Kortið hefur verið tilkynnt stolið og er lokað. Hafðu samband við kortaútgefanda.',
    description: 'Stolen card description',
  },
  closedAccountTitle: {
    id: 'payments:cardError.closedAccountTitle',
    defaultMessage: 'Reikningur lokaður',
    description: 'Closed account',
  },
  closedAccount: {
    id: 'payments:cardError.closedAccount',
    defaultMessage: 'Reikningnum tengdum þessu korti hefur verið lokað.',
    description: 'Closed account description',
  },
  transactionNotPermittedTitle: {
    id: 'payments:cardError.transactionNotPermittedTitle',
    defaultMessage: 'Aðgerð ekki leyfð',
    description: 'Transaction not permitted',
  },
  transactionNotPermitted: {
    id: 'payments:cardError.transactionNotPermitted',
    defaultMessage:
      'Kortið þitt leyfir ekki þessa aðgerð. Hafðu samband við kortaútgefanda.',
    description: 'Transaction not permitted description',
  },
  restrictedCardTitle: {
    id: 'payments:cardError.restrictedCardTitle',
    defaultMessage: 'Takmarkað kort',
    description: 'Restricted card',
  },
  restrictedCard: {
    id: 'payments:cardError.restrictedCard',
    defaultMessage:
      'Kortið þitt hefur takmarkanir og getur ekki verið notað fyrir þessa greiðslu.',
    description: 'Restricted card description',
  },
  suspectedFraudTitle: {
    id: 'payments:cardError.suspectedFraudTitle',
    defaultMessage: 'Grunur um svik',
    description: 'Suspected fraud',
  },
  suspectedFraud: {
    id: 'payments:cardError.suspectedFraud',
    defaultMessage:
      'Greiðslan var stöðvuð vegna gruns um svik. Hafðu samband við kortaútgefanda.',
    description: 'Suspected fraud description',
  },
  exceedsWithdrawalLimitTitle: {
    id: 'payments:cardError.exceedsWithdrawalLimitTitle',
    defaultMessage: 'Yfir dregnum mörkum',
    description: 'Exceeds withdrawal limit',
  },
  exceedsWithdrawalLimit: {
    id: 'payments:cardError.exceedsWithdrawalLimit',
    defaultMessage: 'Þú hefur náð hámarksúttektarmörkum tengdum kortinu þínu.',
    description: 'Exceeds withdrawal limit description',
  },
  securityViolationTitle: {
    id: 'payments:cardError.securityViolationTitle',
    defaultMessage: 'Öryggisbrot',
    description: 'Security violation',
  },
  securityViolation: {
    id: 'payments:cardError.securityViolation',
    defaultMessage:
      'Kortinu hefur verið lokað vegna öryggisbrests. Hafðu samband við kortaútgefanda.',
    description: 'Security violation description',
  },
  refundedBecauseOfSystemErrorTitle: {
    id: 'payments:cardError.refundedBecauseOfSystemErrorTitle',
    defaultMessage: 'Greiðsla endurgreidd',
    description: 'Payment refunded',
  },
  refundedBecauseOfSystemError: {
    id: 'payments:cardError.refundedBecauseOfSystemError',
    defaultMessage:
      'Greiðslan fór í gegn en var endurgreidd vegna kerfisvillu. Vinsamlegast reyndu aftur.',
    description:
      'Payment was refunded due to a system error. Please try again.',
  },
  additionalAuthenticationRequiredTitle: {
    id: 'payments:cardError.additionalAuthenticationRequiredTitle',
    defaultMessage: 'Viðbótarauðkenning krafist',
    description: 'Additional authentication required',
  },
  additionalAuthenticationRequired: {
    id: 'payments:cardError.additionalAuthenticationRequired',
    defaultMessage: 'Til að ljúka greiðslunni þarf frekari auðkenningu.',
    description: 'Additional authentication required description',
  },
  contactIssuerTitle: {
    id: 'payments:cardError.contactIssuerTitle',
    defaultMessage: 'Hafðu samband við kortaútgefanda',
    description: 'Contact issuer',
  },
  contactIssuer: {
    id: 'payments:cardError.contactIssuer',
    defaultMessage:
      'Kortið þarf sérstakt samþykki. Vinsamlegast hafðu samband við kortaútgefanda.',
    description: 'Contact issuer description',
  },
  issuerUnavailableTitle: {
    id: 'payments:cardError.issuerUnavailableTitle',
    defaultMessage: 'Kortaútgefandi ekki tiltækur',
    description: 'Issuer unavailable',
  },
  issuerUnavailable: {
    id: 'payments:cardError.issuerUnavailable',
    defaultMessage:
      'Ekki var hægt að ná sambandi við kortaútgefanda. Reyndu aftur síðar.',
    description: 'Issuer unavailable description',
  },
  duplicateTransactionTitle: {
    id: 'payments:cardError.duplicateTransactionTitle',
    defaultMessage: 'Tvítalin færsla',
    description: 'Duplicate transaction',
  },
  duplicateTransaction: {
    id: 'payments:cardError.duplicateTransaction',
    defaultMessage: 'Þessi greiðsla virðist vera afrit af fyrri greiðslu.',
    description: 'Duplicate transaction description',
  },
  transactionTimedOutTitle: {
    id: 'payments:cardError.transactionTimedOutTitle',
    defaultMessage: 'Greiðsla rann út á tíma',
    description: 'Transaction timed out',
  },
  transactionTimedOut: {
    id: 'payments:cardError.transactionTimedOut',
    defaultMessage: 'Tenging við greiðslukerfið rann út. Reyndu aftur síðar.',
    description: 'Transaction timed out description',
  },
  stopPaymentOrderTitle: {
    id: 'payments:cardError.stopPaymentOrderTitle',
    defaultMessage: 'Stöðvunargjaldskipun',
    description: 'Stop payment order',
  },
  stopPaymentOrder: {
    id: 'payments:cardError.stopPaymentOrder',
    defaultMessage: 'Greiðslan var stöðvuð samkvæmt beiðni frá kortaeiganda.',
    description: 'Stop payment order description',
  },
  revocationOfAuthorizationTitle: {
    id: 'payments:cardError.revocationOfAuthorizationTitle',
    defaultMessage: 'Heimild afturkölluð',
    description: 'Revocation of authorization',
  },
  revocationOfAuthorization: {
    id: 'payments:cardError.revocationOfAuthorization',
    defaultMessage: 'Kortaeigandi afturkallaði heimild fyrir þessa greiðslu.',
    description: 'Revocation of authorization description',
  },
  revocationOfAllAuthorizationsTitle: {
    id: 'payments:cardError.revocationOfAllAuthorizationsTitle',
    defaultMessage: 'Allar heimildir afturkallaðar',
    description: 'Revocation of all authorizations',
  },
  revocationOfAllAuthorizations: {
    id: 'payments:cardError.revocationOfAllAuthorizations',
    defaultMessage:
      'Kortaeigandi afturkallaði allar heimildir tengdar kortinu.',
    description: 'Revocation of all authorizations description',
  },
  paymentSystemUnavailableTitle: {
    id: 'payments:cardError.paymentSystemUnavailableTitle',
    defaultMessage: 'Greiðslukerfi ekki tiltækt',
    description: 'Payment system unavailable',
  },
  paymentSystemUnavailable: {
    id: 'payments:cardError.paymentSystemUnavailable',
    defaultMessage:
      'Ekki var hægt að tengjast greiðslukerfinu. Reyndu aftur síðar.',
    description: 'Payment system unavailable description',
  },
  genericDeclineTitle: {
    id: 'payments:cardError.genericDeclineTitle',
    defaultMessage: 'Greiðslu hafnað',
    description: 'Generic decline',
  },
  genericDecline: {
    id: 'payments:cardError.genericDecline',
    defaultMessage:
      'Greiðslunni var hafnað. Reyndu annað kort eða hafðu samband við kortaútgefanda.',
    description: 'Generic decline description',
  },
  verificationDeadlineExceededTitle: {
    id: 'payments:cardError.verificationDeadlineExceededTitle',
    defaultMessage: 'Beiðni útrunnin',
    description: 'Exceeded time limit to verify card',
  },
  verificationDeadlineExceeded: {
    id: 'payments:cardError.verificationDeadlineExceeded',
    defaultMessage: 'Tími til að staðfesta kort er útrunninn.',
    description: 'Generic decline description',
  },
  unknownTitle: {
    id: 'payments:cardError.unknownTitle',
    defaultMessage: 'Óvænt villa',
    description: 'Unknown error',
  },
  unknown: {
    id: 'payments:cardError.unknown',
    defaultMessage: 'Óvænt villa kom upp við að reyna framkvæma kortagreiðslu',
    description: 'Unknown error description',
  },
})
