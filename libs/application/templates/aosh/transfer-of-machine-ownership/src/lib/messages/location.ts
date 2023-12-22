import { defineMessages } from 'react-intl'

export const location = {
  general: defineMessages({
    title: {
      id: 'aosh.tmo.application:location.general.title',
      defaultMessage: 'Staðsetning tækis',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosh.tmo.application:location.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of location screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.tmo.application:location.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    addressLabel: {
      id: 'aosh.tmo.application:location.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.tmo.application:location.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.tmo.application:location.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    approveButton: {
      id: 'aosh.tmo.application:location.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Location approve button text',
    },
  }),
}
