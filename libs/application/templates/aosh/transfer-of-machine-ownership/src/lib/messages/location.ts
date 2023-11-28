import { defineMessages } from 'react-intl'

export const location = {
  general: defineMessages({
    title: {
      id: 'aosh.application:location.general.title',
      defaultMessage: 'Staðsetning tækis',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosh.application:location.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of location screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.application:location.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    addressLabel: {
      id: 'aosh.application:location.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.application:location.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.application:location.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    selectPlaceholder: {
      id: 'aosh.application:location.labels.selectPlaceholder',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Location select description',
    },
    approveButton: {
      id: 'aosh.application:location.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Location approve button text',
    },
    outOfCommission: {
      id: 'aosh.application:location.labels.outOfCommission',
      defaultMessage: 'Úr umferð, á ekki að tryggja.',
      description: 'Car is out of commission',
    },
  }),
}
