import { defineMessages } from 'react-intl'

export const insurance = {
  general: defineMessages({
    title: {
      id: 'aosh.application:insurance.general.title',
      defaultMessage: 'Staðsetning tækis',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosh.application:insurance.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of insurance screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.application:insurance.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Insurance select title',
    },
    addressLabel: {
      id: 'aosh.application:insurance.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.application:insurance.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.application:insurance.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    selectPlaceholder: {
      id: 'aosh.application:insurance.labels.selectPlaceholder',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Insurance select description',
    },
    approveButton: {
      id: 'aosh.application:insurance.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Insurance approve button text',
    },
    outOfCommission: {
      id: 'aosh.application:insurance.labels.outOfCommission',
      defaultMessage: 'Úr umferð, á ekki að tryggja.',
      description: 'Car is out of commission',
    },
  }),
}
