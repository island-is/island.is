import { defineMessages } from 'react-intl'

export const paymentErrors = defineMessages({
  invalidValue: {
    id: 'aa.application:paymentErrors.invalidValue',
    defaultMessage: 'Ógilt gildi',
    description: 'Invalid value error message',
  },
  paymentInfoValueErrorsMessage: {
    id: 'aa.application:paymentErrors.paymentInfoValueErrors',
    defaultMessage:
      'Ógild gildi fundust. Athugaðu að bankanúmer skal vera 4 tölustafir, höfuðbók 2 tölustafir og reikningsnúmer 4-6 tölustafir',
    description: 'Message for invalid input in payment',
  },
  invalidLedger: {
    id: 'aa.application:paymentErrors.invalidLedger',
    defaultMessage:
      'Ógild höfuðbók, vinsamlegast athugaðu að höfuðbók sé rétt útfyllt',
    description: 'Message for invalid ledger in payment',
  },
  invalidBankNumber: {
    id: 'aa.application:paymentErrors.invalidBankNumber',
    defaultMessage:
      'Ógilt bankanúmer, vinsamlegast athugaðu að bankanúmer sé rétt útfyllt',
    description: 'Message for invalid bank number in payment',
  },
})
