import { defineMessages } from 'react-intl'

export const invoice = defineMessages({
  paymentMethodTitle: {
    id: 'payments:invoice.title',
    defaultMessage: 'Krafa í netbanka',
    description: 'Title for invoice payment method',
  },
  nationalIdOfPayer: {
    id: 'payments:invoice.nationalIdOfPayer',
    defaultMessage: 'Kennitala greiðanda',
    description: 'National id of payer',
  },
  invoiceReference: {
    id: 'payments:invoice.invoiceReference',
    defaultMessage: 'Tilvísun',
    description: 'Invoice reference',
  },
  create: {
    id: 'payments:invoice.create',
    defaultMessage: 'Stofna kröfu',
    description: 'Create invoice',
  },
})

export const invoiceSuccess = defineMessages({
  title: {
    id: 'payments:invoiceSuccess.title',
    defaultMessage: 'Krafa stofnuð',
    description: 'Invoice created successfuly',
  },
  subTitle: {
    id: 'payments:invoiceSuccess.subTitle',
    defaultMessage:
      '[Einhver texti um að krafa hafi verið stofnuð og verði send í netbanka]',
    description: 'Description on invoice creation and online bank',
  },
})
