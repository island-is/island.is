import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'ta.dtwc.application:name',
    defaultMessage: 'Verkstæðiskort',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.dtwc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  externalDataSection: {
    id: 'ta.dtwc.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'ta.dtwc.application:application.title',
    defaultMessage: 'Verkstæðiskort',
    description: `Application's name`,
  },
  externalDataSubTitle: {
    id: 'ta.dtwc.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'ta.dtwc.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  nationalRegistryTitle: {
    id: 'ta.dtwc.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'ta.dtwc.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'ta.dtwc.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'ta.dtwc.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  actionCardDraft: {
    id: 'ta.dtwc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'ta.dtwc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  confirmation: {
    id: 'ta.dtwc.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'cr.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  openMySites: {
    id: 'ta.dtwc.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  successTitle: {
    id: 'ta.dtwc.application:successTitle',
    defaultMessage: 'Beiðni þín um verkstæðiskort hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'ta.dtwc.application:successDescription',
    defaultMessage: ' ',
    description: '',
  },
  actionCardPayment: {
    id: 'cr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  errorDataProvider: {
    id: 'cr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})
