import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'aosh.sr.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'aosh.sr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Götiskráning tækis',
      description: `Application's name`,
    },
    subTitle: {
      id: 'aosh.sr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aosh.sr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'aosh.sr.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'aosh.sr.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'aosh.sr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.sr.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'aosh.sr.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.sr.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aosh.sr.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  myMachines: defineMessages({
    title: {
      id: 'aosh.sr.application:externalData.myMachines.title',
      defaultMessage:
        'Upplýsingar um vélar og tæki í þinni eigu og stöðu þeirra',
      description: 'Your machines',
    },
    subTitle: {
      id: 'aosh.sr.application:externalData.myMachines.subTitle',
      defaultMessage:
        'Upplýsingar úr vinnuvélaskrá  - Upplýsingar um þínar vélar, tæki og stöðu þeirra.',
      description: 'To make stuff easier',
    },
  }),
}
