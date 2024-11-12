import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    pageTitle: {
      id: 'aosh.sr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Skráning á námskeið hjá Vinnueftirlitinu',
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
      description:
        'Agreement of having read the above statements regarding data fetching',
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
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
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
}
