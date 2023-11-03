import { defineMessages } from 'react-intl'

export const insurance = {
  general: defineMessages({
    title: {
      id: 'aosah.application:insurance.general.title',
      defaultMessage: 'Staðsetning tækis',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosah.application:insurance.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of insurance screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosah.application:insurance.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Insurance select title',
    },
    addressLabel: {
      id: 'aosah.application:insurance.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosah.application:insurance.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosah.application:insurance.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    selectPlaceholder: {
      id: 'aosah.application:insurance.labels.selectPlaceholder',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Insurance select description',
    },
    approveButton: {
      id: 'aosah.application:insurance.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Insurance approve button text',
    },
    outOfCommission: {
      id: 'aosah.application:insurance.labels.outOfCommission',
      defaultMessage: 'Úr umferð, á ekki að tryggja.',
      description: 'Car is out of commission',
    },
  }),
}
