import { defineMessages } from 'react-intl'

export const cardDelivery = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlcr.application:cardDelivery.general.sectionTitle',
      defaultMessage: 'Skírteini',
      description: 'Card section title',
    },
    pageTitle: {
      id: 'aosh.mlcr.application:cardDelivery.general.pageTitle',
      defaultMessage: 'Afhendingarmáti',
      description: 'Card delivery page title',
    },
    description: {
      id: 'aosh.mlcr.application:cardDelivery.general.description',
      defaultMessage:
        'Vinsamlegast veldu afhendingarmáta. Skírteinið er alltaf aðgengilegt í gegnum island.is appið óháð því hvaða afhendingarmáti er valinn.',
      description: 'Card delivery page description',
    },
  }),
  labels: defineMessages({
    currentAddress: {
      id: 'aosh.mlcr.application:cardDelivery.labels.currentAddress',
      defaultMessage: 'Sent á lögheimili ({address})',
      description: 'Send to legal domicile radio option',
    },
    currentAddressNoAddress: {
      id: 'aosh.mlcr.application:cardDelivery.labels.currentAddressNoAddress',
      defaultMessage:
        'Sent á lögheimili (ekkert lögheimili fannst í Þjóðskrá – veldu annað heimilisfang)',
      description: 'Send to legal domicile radio option (no address found)',
    },
    otherAddress: {
      id: 'aosh.mlcr.application:cardDelivery.labels.otherAddress',
      defaultMessage: 'Skrá annað heimilisfang',
      description: 'Register another address radio option',
    },
    address: {
      id: 'aosh.mlcr.application:cardDelivery.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address label',
    },
    postalCodeAndCity: {
      id: 'aosh.mlcr.application:cardDelivery.labels.postalCodeAndCity',
      defaultMessage: 'Póstnúmer og staður',
      description: 'Postal code and city label',
    },
    recipient: {
      id: 'aosh.mlcr.application:cardDelivery.labels.recipient',
      defaultMessage: 'Viðtakandi ef annar en skírteinishafi',
      description: 'Recipient label',
    },
  }),
}
