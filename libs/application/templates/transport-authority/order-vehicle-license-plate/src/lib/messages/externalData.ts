import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.ovlp.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Panta skráningarmerki',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.ovlp.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.ovlp.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.ovlp.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'ta.ovlp.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.ovlp.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.ovlp.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá/Fyrirtækjaskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'ta.ovlp.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  currentVehicles: defineMessages({
    title: {
      id: 'ta.ovlp.application:externalData.currentVehicles.title',
      defaultMessage: 'Upplýsingar um bifreiðar í þinni eigu',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.ovlp.application:externalData.currentVehicles.subTitle',
      defaultMessage:
        'Upplýsingar úr ökutækjaskrá - Upplýsingar um þínar bifreiðar.',
      description: 'To make stuff easier',
    },
  }),
}
