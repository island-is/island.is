import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.ovrc.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.ovrc.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Panta skráningarskírteini',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.ovrc.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.ovrc.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.ovrc.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'ta.ovrc.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.ovrc.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.ovrc.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá/Fyrirtækjaskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'ta.ovrc.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  currentVehicles: defineMessages({
    title: {
      id: 'ta.ovrc.application:externalData.currentVehicles.title',
      defaultMessage: 'Upplýsingar um bifreiðar í þinni eigu',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.ovrc.application:externalData.currentVehicles.subTitle',
      defaultMessage:
        'Upplýsingar úr ökutækjaskrá - Upplýsingar um þínar bifreiðar.',
      description: 'To make stuff easier',
    },
    empty: {
      id: 'ta.ovrc.application:externalData.currentVehicles.empty',
      defaultMessage:
        'Þú átt engin ökutæki þar sem þú ert annaðhvort aðaleigandi eða meðeigandi',
      description:
        'You do not have any vehicles where you are either the main owner or co-owner',
    },
  }),
}
