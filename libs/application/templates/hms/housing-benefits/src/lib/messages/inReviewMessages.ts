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
  descriptionFieldTitle: {
    id: 'hb.application:inReview.descriptionFieldTitle',
    defaultMessage: 'Staða umsóknar',
    description: 'In review conclusion description field title',
  },
  descriptionFieldDescription: {
    id: 'hb.application:inReview.descriptionFieldDescription#markdown',
    defaultMessage:
      'Hægt er að sjá stöðu umsóknar og nánari upplýsingar á mínum síðum HMS https://minarsidur.hms.is',
    description: 'In review conclusion description field description',
  },
  expandableDescription: {
    id: 'hb.application:inReview.expandableDescription#markdown',
    defaultMessage:
      '- Yfirferð umsóknar - Starfsfólk HMS fer yfir umsóknina og öll fylgigögn ef á við',
    description: 'In review conclusion description field description',
  },
  bottomButtonMessage: {
    id: 'hb.application:inReview.bottomButtonMessage',
    defaultMessage:
      'Á mínum síðum og í appi eru nú margvíslegar upplýsingar s.s. stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, ökutæki, skírteini, starfsleyfi o.fl.',
    description: 'In review conclusion bottom button message',
  },
  bottomButtonLabel: {
    id: 'hb.application:inReview.bottomButtonLabel',
    defaultMessage: 'Áfram',
    description: 'In review conclusion bottom button label',
  },
})
