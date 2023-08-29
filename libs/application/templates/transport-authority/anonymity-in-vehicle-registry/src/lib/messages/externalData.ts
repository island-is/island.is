import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.avr.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.avr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Nafnleynd í ökutækjaskrá',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.avr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.avr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.avr.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id: 'ta.avr.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.avr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  anonymityStatus: defineMessages({
    title: {
      id: 'ta.avr.application:externalData.anonymityStatus.title',
      defaultMessage: 'Upplýsingar úr ökutækjaskrá',
      description: 'Information from the vehicle registry',
    },
    subTitle: {
      id: 'ta.avr.application:externalData.anonymityStatus.subTitle',
      defaultMessage: 'Sækjum upplýsingar um stöðu nafnleyndar',
      description: 'Get the current status of anonymity',
    },
  }),
}
