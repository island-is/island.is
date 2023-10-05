import { defineMessages } from 'react-intl'

export const insurance = {
  general: defineMessages({
    title: {
      id: 'aosah.application:insurance.general.title',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Title of insurance screen',
    },
    description: {
      id: 'aosah.application:insurance.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of insurance screen',
    },
  }),
  labels: defineMessages({
    selectTitle: {
      id: 'aosah.application:insurance.labels.selectTitle',
      defaultMessage: 'Veldu tryggingarfélag',
      description: 'Insurance select title',
    },
    selectPlaceholder: {
      id: 'aosah.application:insurance.labels.selectPlaceholder',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Insurance select description',
    },
    approveButton: {
      id: 'aosah.application:insurance.labels.approveButton',
      defaultMessage: 'Staðfesta tryggingafélag',
      description: 'Insurance approve button text',
    },
    outOfCommission: {
      id: 'aosah.application:insurance.labels.outOfCommission',
      defaultMessage: 'Úr umferð, á ekki að tryggja.',
      description: 'Car is out of commission',
    },
  }),
}
