import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    pageTitle: {
      id: 'aosh.mlcr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Umsókn um endurútgáfu plastkorts',
      description: 'Prerequisites page title',
    },
    subTitle: {
      id: 'aosh.mlcr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'The following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aosh.mlcr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description:
        'Agreement of having read the above statements regarding data fetching',
    },
    submitButton: {
      id: 'aosh.mlcr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Staðfesta',
      description: 'Prerequisites submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.mlcr.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry',
    },
    subTitle: {
      id: 'aosh.mlcr.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.mlcr.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aosh.mlcr.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  ver: defineMessages({
    title: {
      id: 'aosh.mlcr.application:externalData.ver.title',
      defaultMessage: 'Upplýsingar frá Vinnueftirlitinu',
      description: 'Information from AOSH',
    },
    subTitle: {
      id: 'aosh.mlcr.application:externalData.ver.subTitle',
      defaultMessage: 'Sóttar eru upplýsingar um vinnuvélaréttindi.',
      description: 'We will fetch work machine licenses',
    },
  }),
}
