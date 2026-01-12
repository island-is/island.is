import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.cov.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.cov.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Bæta við umráðamanni á ökutæki',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.cov.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.cov.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.cov.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'ta.cov.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.cov.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.cov.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá/Fyrirtækjaskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'ta.cov.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ta.cov.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'ta.cov.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  currentVehicles: defineMessages({
    title: {
      id: 'ta.cov.application:externalData.currentVehicles.title',
      defaultMessage: 'Upplýsingar úr ökutækjaskrá',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.cov.application:externalData.currentVehicles.subTitle',
      defaultMessage: 'Skjal sem inniheldur þau ökuréttindi sem þú hefur',
      description: 'To make stuff easier',
    },
  }),
}
