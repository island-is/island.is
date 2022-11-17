import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.dtdc.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Ökumannskort',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.dtdc.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    getDataSuccess: {
      id: 'ta.dtdc.application:externalData.dataProvider.getDataSuccess',
      defaultMessage: 'Tókst að sækja gögn',
      description: 'Was able to get data',
    },
    getDataSuccessDescription: {
      id:
        'ta.dtdc.application:externalData.dataProvider.getDataSuccessDescription',
      defaultMessage: 'Með gagnaöflun tókst að sækja eftirfarandi gögn:',
      description: 'Was able to get data description',
    },
    submitButton: {
      id: 'ta.dtdc.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.dtdc.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Personal information from the National Registry',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description:
        'Information from the National Registry will be used to prefill the data in the application',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ta.dtdc.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  drivingLicense: defineMessages({
    title: {
      id: 'ta.dtdc.application:externalData.drivingLicense.subTitle',
      defaultMessage: 'Upplýsingar úr ökuskírteinaskrá',
      description: 'Information from driving license registry',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.drivingLicense.subTitle',
      defaultMessage: 'Sóttar eru almennar upplýsingar um núverandi réttindi.',
      description: 'General information about current licenses.',
    },
    missing: {
      id: 'ta.dtdc.application:externalData.drivingLicense.missing',
      defaultMessage:
        'Þú ert ekki með nauðsynleg réttindi til að sækja um blabla',
      description: 'You do not have enough permission to apply blabla',
    },
  }),
  nationalRegistryCustom: defineMessages({
    missing: {
      id: 'ta.dtdc.application:externalData.nationalRegistryCustom.missing',
      defaultMessage: 'Þú ert ekki með lögheimili á Íslandi blabla',
      description: 'You do not have a domicile in Iceland blabla',
    },
  }),
  qualityPhotoAndSignature: defineMessages({
    missing: {
      id: 'ta.dtdc.application:externalData.qualityPhotoAndSignature.missing',
      defaultMessage:
        'Þú ert ekki með nauðsynleg réttindi til að sækja um blabla',
      description: 'You do not have enough permission to apply blabla',
    },
  }),
}
