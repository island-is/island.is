import { defineMessages } from 'react-intl'

export const license = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:license.general.sectionTitle',
      defaultMessage: 'Skírteini',
      description: 'Title of license section',
    },
    title: {
      id: 'aosh.mlr.application:license.general.title',
      defaultMessage: 'Skírteini',
      description: 'Title of license screen',
    },
    description: {
      id: 'aosh.mlr.application:license.general.description',
      defaultMessage:
        'Vinnuvélaskírteinið þitt er alltaf aðgengilegt sem stafrænt skírteini í island.is appinu. Ef þú vilt getur þú einnig fengið það sent sem plastkort.',
      description: 'Description of license screen',
    },
  }),
  labels: defineMessages({
    plasticCard: {
      id: 'aosh.mlr.application:license.labels.plasticCard',
      defaultMessage: 'Á að senda þér skírteinið sem plastkort?',
      description: 'Plastic card question',
    },
    deliveryMethod: {
      id: 'aosh.mlr.application:license.labels.deliveryMethod',
      defaultMessage: 'Afhendingarmáti',
      description: 'Delivery method question',
    },
    legalDomicile: {
      id: 'aosh.mlr.application:license.labels.legalDomicile',
      defaultMessage: 'Sent á lögheimili ({address})',
      description: 'Delivery method option, sent to legal domicile',
    },
    otherAddress: {
      id: 'aosh.mlr.application:license.labels.otherAddress',
      defaultMessage: 'Skrá annað heimilisfang',
      description: 'Delivery method option, other address',
    },
    address: {
      id: 'aosh.mlr.application:license.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address label',
    },
    postalCodeAndCity: {
      id: 'aosh.mlr.application:license.labels.postalCodeAndCity',
      defaultMessage: 'Póstnúmer og staður',
      description: 'Postal code and city label',
    },
    recipient: {
      id: 'aosh.mlr.application:license.labels.recipient',
      defaultMessage: 'Viðtakandi ef annar en skírteinishafi',
      description: 'Recipient label',
    },
  }),
}
