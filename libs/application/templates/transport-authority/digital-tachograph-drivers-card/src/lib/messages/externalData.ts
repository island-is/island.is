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
      id: 'ta.dtdc.application:externalData.dataProvider.getDataSuccessDescription',
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
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
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
      id: 'ta.dtdc.application:externalData.drivingLicense.title',
      defaultMessage: 'Upplýsingar úr ökuskírteinaskrá',
      description: 'Information from driving license registry',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.drivingLicense.subTitle',
      defaultMessage: 'Mynd, undirskrift og réttindi',
      description: 'General information about current licenses.',
    },
  }),
  qualityPhotoAndSignature: defineMessages({
    error: {
      id: 'ta.dtdc.application:externalData.qualityPhotoAndSignature.error',
      defaultMessage:
        'Það kom upp villa við að sækja mynd og undirskrift úr ökuskírteinaskrá',
      description:
        'An error occured fetching photo and signature in driving license registry',
    },
    missing: {
      id: 'ta.dtdc.application:externalData.qualityPhotoAndSignature.missing',
      defaultMessage: 'Ekki fannst mynd og undirskrift úr ökuskírteinaskrá',
      description:
        'Did not find photo and signature in driving license registry',
    },
  }),
  newestDriversCard: defineMessages({
    error: {
      id: 'ta.dtdc.application:externalData.newestDriversCard.error',
      defaultMessage:
        'Það kom upp villa við að sækja íslenskt útgefið ökumannskort',
      description:
        'An error occured fetching drivers cards published in Iceland',
    },
    title: {
      id: 'ta.dtdc.application:externalData.newestDriversCard.title',
      defaultMessage: 'Upplýsingar úr ökutækjaskrá',
      description: 'Information from the vehicle registry',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.newestDriversCard.subTitle',
      defaultMessage: 'Fyrir íslensk útgefin ökumannskort',
      description: 'For drivers cards published in Iceland',
    },
  }),
  tachonetDriversCard: defineMessages({
    title: {
      id: 'ta.dtdc.application:externalData.tachonetDriversCard.title',
      defaultMessage: 'Upplýsingar úr Tacho net ',
      description: 'Information from the vehicle registry',
    },
    subTitle: {
      id: 'ta.dtdc.application:externalData.tachonetDriversCard.subTitle',
      defaultMessage: 'Fyrir erlend útgefin ökumannskort',
      description: 'For drivers cards published in Iceland',
    },
  }),
  submit: defineMessages({
    error: {
      id: 'ta.dtdc.application:externalData.submit.error',
      defaultMessage: 'Það kom upp villa við að senda inn umsókn',
      description: 'An error occured submitting application',
    },
  }),
}
