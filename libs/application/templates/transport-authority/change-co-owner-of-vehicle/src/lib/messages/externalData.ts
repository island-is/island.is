import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ta.ccov.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'ta.ccov.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Bæta við meðeiganda á ökutæki',
      description: `Application's name`,
    },
    subTitle: {
      id: 'ta.ccov.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'ta.ccov.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ta.ccov.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá/Fyrirtækjaskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'ta.ccov.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ta.ccov.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'ta.ccov.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  currentVehicles: defineMessages({
    title: {
      id: 'ta.ccov.application:externalData.currentVehicles.title',
      defaultMessage: 'Upplýsingar úr ökutækjaskrá',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.ccov.application:externalData.currentVehicles.subTitle',
      defaultMessage: 'Skjal sem inniheldur þau ökuréttindi sem þú hefur',
      description: 'To make stuff easier',
    },
  }),
  payment: defineMessages({
    title: {
      id: 'ta.ccov.application:externalData.payment.title',
      defaultMessage: 'Upplýsingar frá Fjársýslunni',
      description: 'Your vehicles from the vehicle registry',
    },
    subTitle: {
      id: 'ta.ccov.application:externalData.payment.subTitle',
      defaultMessage: 'Um stöðu bifreiðagjalda',
      description: 'To make stuff easier',
    },
  }),
}
