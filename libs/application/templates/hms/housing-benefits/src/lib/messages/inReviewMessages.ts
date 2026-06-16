import { defineMessages } from 'react-intl'

export const inReviewMessages = defineMessages({
  tabTitle: {
    id: 'hb.application:inReview.tabTitle',
    defaultMessage: 'Umsókn í vinnslu',
    description: 'In review conclusion tab title',
  },
  alertTitle: {
    id: 'hb.application:inReview.alertTitle',
    defaultMessage: 'Umsókn hefur verið send inn til HMS',
    description: 'In review conclusion alert title',
  },
  alertMessage: {
    id: 'hb.application:inReview.alertMessage',
    defaultMessage:
      'Umsóknin þín er nú í vinnslu hjá HMS og verður tekin til afgreiðslu sem fyrst.',
    description: 'In review conclusion alert message',
  },
})
