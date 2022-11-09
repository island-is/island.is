import { defineMessages } from 'react-intl'

export const insurance = {
  general: defineMessages({
    title: {
      id: 'ta.tvo.application:insurance.general.title',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Title of insurance screen',
    },
    description: {
      id: 'ta.tvo.application:insurance.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of insurance screen',
    },
  }),
  labels: defineMessages({
    selectTitle: {
      id: 'ta.tvo.application:insurance.labels.selectTitle',
      defaultMessage: 'Veldu tryggingarfélag',
      description: 'Insurance select title',
    },
    selectPlaceholder: {
      id: 'ta.tvo.application:insurance.labels.selectPlaceholder',
      defaultMessage: 'Veldu tryggingafélag',
      description: 'Insurance select description',
    },
    approveButton: {
      id: 'ta.tvo.application:insurance.labels.approveButton',
      defaultMessage: 'Staðfesta tryggingafélag',
      description: 'Insurance approve button text',
    },
  }),
}
