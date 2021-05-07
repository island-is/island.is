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
      id: `${t}:section.externalData.paymentPlanTitle`,
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'External data section payment plan title',
    },
    paymentPlanSubtitle: {
      id: `${t}:section.externalData.paymentPlanSubtitle`,
      defaultMessage: 'Upplýsingar um ráðstöfunartekjur. ',
      description: 'External data section payment plan subtitle',
    },
    nationalRegistryTitle: {
      id: `${t}:section.externalData.nationRegistryTitle`,
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National Registry Title',
    },
    nationalRegistrySubTitle: {
      id: `${t}:section.externalData.nationalRegistrySubTitle`,
      defaultMessage: 'Nafn, kennitala og lögheimili.',
      description: 'National Registry Subtitle',
    },
    userProfileTitle: {
      id: `${t}:section.externalData.userProfileTitle`,
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User Profile Title',
    },
    userProfileSubTitle: {
      id: `${t}:section.externalData.userProfileSubTitle`,
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'User Profile Subtitle',
    },
  }),
}
