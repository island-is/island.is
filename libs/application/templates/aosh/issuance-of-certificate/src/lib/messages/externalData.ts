import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'aosh.ioc.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'aosh.ioc.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: `Application's name`,
    },
    subTitle: {
      id: 'aosh.ioc.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aosh.ioc.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.ioc.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'aosh.ioc.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.ioc.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aosh.ioc.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  certificates: defineMessages({
    title: {
      id: 'aosh.ioc.application:externalData.certificates.title',
      defaultMessage: 'Upplýsingar frá Vinnueftirlitinu',
      description: 'Information from Vinnueftirlitið',
    },
    subTitle: {
      id: 'aosh.ioc.application:externalData.certificates.subTitle',
      defaultMessage: 'Vinnueftirlitið flettir upp réttindum og skírteinum',
      description: 'We collect you information bout your machine certificates',
    },
  }),
}
