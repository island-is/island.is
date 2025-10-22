import { defineMessages } from 'react-intl'

export const conclusion = defineMessages({
  tabTitle: {
    id: 'ronp.application:conclusion.title',
    defaultMessage: 'Staðfesting',
    description: 'conclusion tab title',
  },
  title: {
    id: 'ronp.application:conclusion.title',
    defaultMessage: 'Greiðsla móttekin',
    description: 'conclusion title',
  },
  alertTitle: {
    id: 'ronp.application:conclusion.alertTitle',
    defaultMessage: 'Staðfesting á greiðslu hefur verið send til HMS',
    description: 'conclusion alert title',
  },
  expandableIntro: {
    id: 'ronp.application:conclusion.expandableIntro',
    defaultMessage:
      'Að greiðslu lokinni verður beiðnin tekin til afgreiðslu hjá HMS, þar sem ný fasteignanúmer verða staðfest í fasteignaskrá.',
    description: 'conclusion expandable intro',
  },
  alertInfo: {
    id: 'ronp.application:conclusion.alertInfo',
    defaultMessage:
      'Kvittun fyrir greiðslu verður send með tölvupósti á umsækjanda og tengilið en einnig verður hægt að nálgast hana á mínum síðum á Ísland.is',
    description: 'conclusion alert info',
  },
  actionCardDone: {
    id: 'ronp.application:conclusion.actionCardDone',
    defaultMessage: 'Umsókn sent',
    description: 'Action card done',
  },
})
