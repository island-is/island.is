import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

// Global string for the application
export const externalData = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:application.externalData.pageTitle`,
      defaultMessage: 'Gagnaöflun',
      description: 'External data section page title',
    },
    subTitle: {
      id: `pdpp.application:application.externalData.subTitle`,
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt:',
      description: 'External data section sub title',
    },
    checkboxLabel: {
      id: `pdpp.application:application.externalData.checkboxLabel`,
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu á þessari umsókn.',
      description: 'External data checkbox label',
    },
  }),
  labels: defineMessages({
    paymentPlanTitle: {
      id: `pdpp.application:section.externalData.paymentPlanTitle`,
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'External data section payment plan title',
    },
    paymentPlanSubtitle: {
      id: `pdpp.application:section.externalData.paymentPlanSubtitle`,
      defaultMessage: 'Upplýsingar um ráðstöfunartekjur. ',
      description: 'External data section payment plan subtitle',
    },
    nationalRegistryTitle: {
      id: `pdpp.application:section.externalData.nationRegistryTitle`,
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National Registry Title',
    },
    nationalRegistrySubTitle: {
      id: `pdpp.application:section.externalData.nationalRegistrySubTitle`,
      defaultMessage: 'Nafn, kennitala og lögheimili.',
      description: 'National Registry Subtitle',
    },
    userProfileTitle: {
      id: `pdpp.application:section.externalData.userProfileTitle`,
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User Profile Title',
    },
    userProfileSubTitle: {
      id: `pdpp.application:section.externalData.userProfileSubTitle`,
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'User Profile Subtitle',
    },
    paymentEmployerTitle: {
      id: `pdpp.application:section.externalData.paymentEmployerTitle`,
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'External data section payment plan title',
    },
    paymentEmployerSubtitle: {
      id: `pdpp.application:section.externalData.paymentEmployerSubtitle`,
      defaultMessage: 'Upplýsingar um vinnuveitanda',
      description: 'External data section payment plan title',
    },
    paymentDebtsTitle: {
      id: `pdpp.application:section.externalData.paymentEmployerTitle`,
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'External data section payment plan title',
    },
    paymentDebtsSubtitle: {
      id: `pdpp.application:section.externalData.paymentEmployerSubtitle`,
      defaultMessage: 'Upplýsingar um skuldir',
      description: 'External data section payment plan title',
    },
  }),
}
