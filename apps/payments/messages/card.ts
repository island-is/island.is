import { defineMessages } from 'react-intl'

export const card = defineMessages({
  cardPaymentMethodTitle: {
    id: 'payments.card:title',
    defaultMessage: 'Kortagreiðsla',
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
    defaultMessage: 'Öryggiskóði',
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

export const cardError = defineMessages({
  cardNumber: {
    id: 'payments.card:cardNumberError',
    defaultMessage: 'Kortanúmer er nauðsynlegt',
    description: 'Card number is required',
  },
  invalidCardNumber: {
    id: 'payments.card:invalidCardNumberError',
    defaultMessage: 'Ógilt kortanúmer',
    description: 'Invalid card number',
  },
  cardNumberTooShort: {
    id: 'payments.card:cardNumberTooShortError',
    defaultMessage: 'Kortanúmer er of stutt',
    description: 'Card number is too short',
  },
  cardExpiry: {
    id: 'payments.card:cardExpiryError',
    defaultMessage: 'Gildistími er nauðsynlegur',
    description: 'Card expiry is required',
  },
  cardExpiryExpired: {
    id: 'payments.card:cardExpiryExpiredError',
    defaultMessage: 'Kort er útrunnið',
    description: 'Card is expired',
  },
  cardExpiryInvalid: {
    id: 'payments.card:cardExpiryInvalidError',
    defaultMessage: 'Ógildur gildistími',
    description: 'Invalid expiry date',
  },
  cardExpiryInvalidMonth: {
    id: 'payments.card:cardExpiryInvalidMonth',
    defaultMessage: 'Ógildur mánuður',
    description: 'Invalid expiry date month',
  },
  cardCVC: {
    id: 'payments.card:cardCVCError',
    defaultMessage: 'Öryggiskóði er nauðsynlegur',
    description: 'Card CVC is required',
  },
  cardCVCTooShort: {
    id: 'payments.card:cardCVCTooShortError',
    defaultMessage: 'Öryggiskóði er of stuttur',
    description: 'Card CVC is too short',
  },
})
