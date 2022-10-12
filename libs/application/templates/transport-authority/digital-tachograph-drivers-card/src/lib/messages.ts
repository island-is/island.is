import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'ta.dtdc.application:name',
    defaultMessage: 'Ökumannskort',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.dtdc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  externalDataSection: {
    id: 'ta.dtdc.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'ta.dtdc.application:application.title',
    defaultMessage: 'Ökumannskort',
    description: `Application's name`,
  },
  externalDataSubTitle: {
    id: 'ta.dtdc.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'ta.dtdc.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  nationalRegistryTitle: {
    id: 'ta.dtdc.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'ta.dtdc.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'ta.dtdc.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'ta.dtdc.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  actionCardDraft: {
    id: 'ta.dtdc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'ta.dtdc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  confirmation: {
    id: 'ta.dtdc.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'cr.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  openMySites: {
    id: 'ta.dtdc.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  successTitle: {
    id: 'ta.dtdc.application:successTitle',
    defaultMessage: 'Beiðni þín um ökumannskort hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'ta.dtdc.application:successDescription',
    defaultMessage: ' ',
    description: '',
  },
  licenseCategoryProviderTitle: {
    id: 'ta.dtdc.application:infoFromLicenseRegistryTitle',
    defaultMessage: 'Upplýsingar úr ökuskírteinaskrá',
    description: 'Information from driving license registry',
  },
  licenseCategoryProviderSubTitle: {
    id: 'ta.dtdc.application:infoFromLicenseRegistrySubTitle',
    defaultMessage: 'Sóttar eru almennar upplýsingar um núverandi réttindi.',
    description: 'General information about current licenses.',
  },
  licenseCategoryProviderErrorMissing: {
    id: 'ta.dtdc.application:licenseCategoryErrorMissing',
    defaultMessage:
      'Þú ert ekki með nauðsynleg réttindi til að sækja um blabla',
    description: 'You do not have enough permission to apply blabla',
  },
})
