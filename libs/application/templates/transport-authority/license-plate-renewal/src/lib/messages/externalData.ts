import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.lpr.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.lpr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Endurnýja einkanúmer',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.lpr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.lpr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.lpr.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id:
        'ta.lpr.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.lpr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  myPlateOwnerships: defineMessages({
    title: {
      id: 'ta.lpr.application:externalData.myPlateOwnerships.title',
      defaultMessage: 'Upplýsingar úr ökutækjaskrá',
      description: 'Your plate ownerships',
    },
    subTitle: {
      id: 'ta.lpr.application:externalData.myPlateOwnerships.subTitle',
      defaultMessage: 'Upplýsingar um einkanúmer sem þú átt',
      description: 'Your plate ownerships from XX',
    },
  }),
}
