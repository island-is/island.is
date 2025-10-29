import { defineMessages } from 'react-intl'

export const conclusion = defineMessages({
  tabTitle: {
    id: 'ronp.application:conclusion.tabTitle',
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
      'Beiðnin verður tekin til afgreiðslu hjá HMS þar sem ný fasteignanúmer verða staðfest í fasteignaskrá.',
    description: 'conclusion expandable intro',
  },
  actionCardDone: {
    id: 'ronp.application:conclusion.actionCardDone',
    defaultMessage: 'Send til HMS',
    description: 'Action card done',
  },
})
