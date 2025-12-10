import { defineMessages } from 'react-intl'

export const states = defineMessages({
  applicationSubmittedDescription: {
    id: 'dp.application:applicationSubmittedDescription',
    defaultMessage: 'Umsókn þín hefur verið send til Tryggingastofnunar',
    description:
      'Your application has been submitted to the Social Insurance Administration',
  },
  applicationDismissed: {
    id: 'dp.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um örorkulífeyri frá',
    description:
      'Tryggingastofnun has dismissed your application for disability pension',
  },
  applicationDismissedDescription: {
    id: 'dp.application:application.dismissed.description',
    defaultMessage: 'Umsókn þinni um örorkulífeyri hefur verið vísað frá',
    description: 'Your application for disability pension has been dismissed',
  },
  applicationRejectedDescription: {
    id: 'dp.application:applicationRejectedDescription',
    defaultMessage: 'Umsókn um örorkulífeyri hefur verið synjað',
    description: 'The application for disability pension has been rejected',
  },
})
