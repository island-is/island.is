import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

// Global string for the application
export const externalData = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:application.externalData.pageTitle`,
      defaultMessage: 'Gagnaöflun',
      description: 'External data section page title',
    },
    subTitle: {
      id: `${t}:application.externalData.subTitle`,
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt:',
      description: 'External data section sub title',
    },
    checkboxLabel: {
      id: `${t}:application.externalData.checkboxLabel`,
      defaultMessage: 'Ég samþykki',
      description: 'External data checkbox label',
    },
  }),
  labels: defineMessages({
    paymentPlanTitle: {
      id: `${t}:application.externalData.paymentPlanTitle`,
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'External data section payment plan title',
    },
    paymentPlanSubtitle: {
      id: `${t}:application.externalData.paymentPlanSubtitle`,
      defaultMessage: 'Upplýsingar um ráðstöfunartekjur. ',
      description: 'External data section payment plan subtitle',
    },
  }),
}
