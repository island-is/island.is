import { defineMessages } from 'react-intl'

export const card = defineMessages({
  paymentMethodTitle: {
    id: 'payments.card:title',
    defaultMessage: 'Greiðslukort',
    description: 'Title for card payment method',
  },
  cardNumber: {
    id: 'payments.card:cardNumber',
    defaultMessage: 'Kortanúmer',
    description: 'Card number',
  },
  cardNumberPlaceholder: {
    id: 'payments.card:cardNumberPlaceholder',
    defaultMessage: '**** **** **** ****',
    description: 'Card number placeholder',
  },
  cardExpiry: {
    id: 'payments.card:cardExpiry',
    defaultMessage: 'Gildistími',
    description: 'Card expiry',
  },
  cardExpiryPlaceholder: {
    id: 'payments.card:cardExpiryPlaceholder',
    defaultMessage: 'MM/ÁÁ',
    description: 'MM/YY',
  },
  cardCVC: {
    id: 'payments.card:cardCVC',
    defaultMessage: 'CVC',
    description: 'Card CVC',
  },
  cardCVCPlaceholder: {
    id: 'payments.card:cardCVCPlaceholder',
    defaultMessage: '***',
    description: 'Card CVC placeholder',
  },
  pay: {
    id: 'payments.card:pay',
    defaultMessage: 'Greiða',
    description: 'Pay',
  },
})

export const cardValidationError = defineMessages({
  cardNumber: {
    id: 'payments.validationError.card:cardNumberError',
    defaultMessage: 'Kortanúmer er nauðsynlegt',
    description: 'Card number is required',
  },
  invalidCardNumber: {
    id: 'payments.validationError.card:invalidCardNumberError',
    defaultMessage: 'Ógilt kortanúmer',
    description: 'Invalid card number',
  },
  cardNumberTooShort: {
    id: 'payments.validationError.card:cardNumberTooShortError',
    defaultMessage: 'Kortanúmer er of stutt',
    description: 'Card number is too short',
  },
  cardExpiry: {
    id: 'payments.validationError.card:cardExpiryError',
    defaultMessage: 'Gildistími er nauðsynlegur',
    description: 'Card expiry is required',
  },
  cardExpiryExpired: {
    id: 'payments.validationError.card:cardExpiryExpiredError',
    defaultMessage: 'Kort er útrunnið',
    description: 'Card is expired',
  },
  cardExpiryInvalid: {
    id: 'payments.validationError.card:cardExpiryInvalidError',
    defaultMessage: 'Ógildur gildistími',
    description: 'Invalid expiry date',
  },
  cardExpiryInvalidMonth: {
    id: 'payments.validationError.card:cardExpiryInvalidMonth',
    defaultMessage: 'Ógildur mánuður',
    description: 'Invalid expiry date month',
  },
  cardCVC: {
    id: 'payments.validationError.card:cardCVCError',
    defaultMessage: 'Öryggiskóði er nauðsynlegur',
    description: 'Card CVC is required',
  },
  cardCVCTooShort: {
    id: 'payments.validationError.card:cardCVCTooShortError',
    defaultMessage: 'Öryggiskóði er of stuttur',
    description: 'Card CVC is too short',
  },
})

export const cardError = defineMessages({
  insufficientFundsTitle: {
    id: 'payments.cardError:insufficientFundsTitle',
    defaultMessage: 'Ekki heimild',
    description: 'Insufficient funds',
  },
  insufficientFunds: {
    id: 'payments.cardError:insufficientFunds',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ónægrar ráðstöfunar á kortinu',
    description: 'Insufficient funds',
  },
  expiredCardTitle: {
    id: 'payments.cardError:expiredCardTitle',
    defaultMessage: 'Kort útrunnið',
    description: 'Expired card',
  },
  expiredCard: {
    id: 'payments.cardError:expiredCard',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna þess að kortið er útrunnið',
    description: 'Expired card',
  },
  invalidCardNumberTitle: {
    id: 'payments.cardError:invalidCardNumberTitle',
    defaultMessage: 'Ógilt kortanúmer',
    description: 'Invalid card number',
  },
  invalidCardNumber: {
    id: 'payments.cardError:invalidCardNumber',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds kortanúmers',
    description: 'Invalid card number',
  },
  invalidCardExpiryTitle: {
    id: 'payments.cardError:invalidCardExpiryTitle',
    defaultMessage: 'Ógildur gildistími',
    description: 'Invalid expiry date',
  },
  invalidCardExpiry: {
    id: 'payments.cardError:invalidCardExpiry',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds gildistíma',
    description: 'Invalid expiry date',
  },
  invalidCardCVCTitle: {
    id: 'payments.cardError:invalidCardCVCTitle',
    defaultMessage: 'Ógildur öryggiskóði',
    description: 'Invalid CVC',
  },
  invalidCardCVC: {
    id: 'payments.cardError:invalidCardCVC',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds öryggiskóða',
    description: 'Invalid CVC',
  },
  invalidCardTitle: {
    id: 'payments.cardError:invalidCardTitle',
    defaultMessage: 'Ógilt kort',
    description: 'Invalid card',
  },
  invalidCard: {
    id: 'payments.cardError:invalidCard',
    defaultMessage:
      'Ekki var hægt að framkvæma kortagreiðslu vegna ógilds kort',
    description: 'Invalid card',
  },
  unknownTitle: {
    id: 'payments.cardError:unknownTitle',
    defaultMessage: 'Óvænt villa',
    description: 'Unknown error',
  },
  unknown: {
    id: 'payments.cardError:unknown',
    defaultMessage: 'Óvænt villa kom upp við að reyna framkvæma kortagreiðslu',
    description: 'Unknown error',
  },
})
