import { defineMessages } from 'react-intl'

export const plateDelivery = {
  general: defineMessages({
    title: {
      id: 'aosh.sr.application:plateDelivery.general.title',
      defaultMessage: 'Afhending merkis',
      description: 'Title of plate delivery sub section',
    },
    description: {
      id: 'aosh.sr.application:plateDelivery.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of plate delivery sub section',
    },
    radioTitle: {
      id: 'aosh.sr.application:plateDelivery.general.radioTitle',
      defaultMessage: 'Veldu afhendingarstað skráningarmerkis',
      description: 'Title of plate delivery radio field',
    },
  }),
  labels: defineMessages({
    currentAddress: {
      id: 'aosh.sr.application:plateDelivery.labels.currentAddress',
      defaultMessage: 'Lögheimili',
      description: 'Label for current address',
    },
    otherAddress: {
      id: 'aosh.sr.application:plateDelivery.labels.otherAddress',
      defaultMessage: 'Annað heimilisfang',
      description: 'Label for other address',
    },
    addressLabel: {
      id: 'aosh.sr.application:plateDelivery.labels.addressLabel',
      defaultMessage: 'Afhendingarstaður',
      description: 'Label for address',
    },
    addressPlaceholder: {
      id: 'aosh.sr.application:plateDelivery.labels.addressPlaceholder',
      defaultMessage: 'Heimilisfang',
      description: 'Placeholder for address',
    },
    cityLabel: {
      id: 'aosh.sr.application:plateDelivery.labels.city',
      defaultMessage: 'Staður',
      description: 'Label for city',
    },
    postCodeLabel: {
      id: 'aosh.sr.application:plateDelivery.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Label for post code',
    },
    recepientLabel: {
      id: 'aosh.sr.application:plateDelivery.labels.recepientLabel',
      defaultMessage: 'Nafn viðtakanda',
      description: 'Label for recepient',
    },
  }),
}
