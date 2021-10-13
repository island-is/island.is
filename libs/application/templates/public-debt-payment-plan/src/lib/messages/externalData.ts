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
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'External data section sub title',
    },
    checkboxLabel: {
      id: `pdpp.application:application.externalData.checkboxLabel`,
      defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
      description: 'External data checkbox label',
    },
    description: {
      id: `pdpp.application:application.externalData.description`,
      defaultMessage:
        'Tilagangur neðangreindrar upplýsingaöflunar er að gera greiðsluáætlun skv. 12. gr. laga um innheimtu opinberra skatta og gjalda, nr. 150/2019.',
      description: 'External data description',
    },
  }),
  labels: defineMessages({
    paymentPlanTitle: {
      id: `pdpp.application:section.externalData.paymentPlanTitle`,
      defaultMessage: 'Upplýsingar frá Innheimtustofnun sveitarfélaga',
      description: 'External data section payment plan title',
    },
    paymentPlanSubtitle: {
      id: `pdpp.application:section.externalData.paymentPlanSubtitle`,
      defaultMessage: 'Upplýsingar um meðlagsgreiðslur.',
      description: 'External data section payment plan subtitle',
    },
    nationalRegistryTitle: {
      id: `pdpp.application:section.externalData.nationRegistryTitle`,
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'National Registry Title',
    },
    nationalRegistrySubTitle: {
      id: `pdpp.application:section.externalData.nationalRegistrySubTitle`,
      defaultMessage: 'Nafn, kennitala, símanúmer, netfang.',
      description: 'National Registry Subtitle',
    },
    userProfileTitle: {
      id: `pdpp.application:section.externalData.userProfileTitle`,
      defaultMessage: 'Upplýsingar frá Skattinum og Fjársýslunni',
      description: 'User Profile Title',
    },
    userProfileSubTitle: {
      id: `pdpp.application:section.externalData.userProfileSubTitle`,
      defaultMessage:
        'Upplýsingar um stöðu krafna, launagreiðanda og ráðstöfunartekjur samkvæmt staðgreiðsluskrá. ',
      description: 'User Profile Subtitle',
    },
    paymentEmployerTitle: {
      id: `pdpp.application:section.externalData.paymentEmployerTitle`,
      defaultMessage: 'Samþykki fyrir tilkynningar',
      description: 'External data section payment plan title',
    },
    paymentEmployerSubtitle: {
      id: `pdpp.application:section.externalData.paymentEmployerSubtitle`,
      defaultMessage: 'Skilaboð um greiðslur o.fl. verða send til þín.',
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
