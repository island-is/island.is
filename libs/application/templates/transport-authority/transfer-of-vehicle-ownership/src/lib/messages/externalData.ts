import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.tvo.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.tvo.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Tilkynning um eigendaskipti að ökutæki',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.tvo.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.tvo.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.tvo.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id:
        'ta.tvo.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.tvo.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.tvo.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Personal information from the National Registry',
    },
    subTitle: {
      id: 'ta.tvo.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description:
        'Information from the National Registry will be used to prefill the data in the application',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ta.tvo.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'ta.tvo.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  currentVehicles: defineMessages({
    title: {
      id: 'ta.tvo.application:externalData.currentVehicles.title',
      defaultMessage: 'Upplýsingar um bifreiðar í þinni eigu og stöðu þeirra',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.tvo.application:externalData.currentVehicles.subTitle',
      defaultMessage:
        'Upplýsingar úr ökutækjaskrá  - Upplýsingar um þínar bifreiðar og stöðu þeirra.',
      description: 'To make stuff easier',
    },
    empty: {
      id: 'ta.tvo.application:externalData.currentVehicles.empty',
      defaultMessage: 'Þú átt engin ökutæki þar sem þú ert aðaleigandi',
      description: 'You do not have any vehicles where you are the main owner',
    },
  }),
  payment: defineMessages({
    title: {
      id: 'ta.tvo.application:externalData.payment.title',
      defaultMessage: 'Upplýsingar frá Fjársýslunni',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.tvo.application:externalData.payment.subTitle',
      defaultMessage: 'Um stöðu bifreiðagjalda',
      description: 'To make stuff easier',
    },
    empty: {
      id: 'ta.tvo.application:externalData.payment.empty',
      defaultMessage: 'Ekki tókst að sækja upplýsingar frá Fjársýslunni',
      description: 'You do not have any vehicles where you are the main owner',
    },
  }),
}
