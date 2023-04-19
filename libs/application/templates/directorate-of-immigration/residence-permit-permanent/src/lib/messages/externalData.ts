import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    pageTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Page title of external data section',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'The following data will be retrieved electronically',
    },
    description: {
      id: 'doi.rpp.application:externalData.dataProvider.description',
      defaultMessage:
        'Integer id augue in erat ultrices pharetra a vel neque. Integer pellentesque, erat vel varius imperdiet, nisl turpis imperdiet augue, at vulputate lorem mauris in nibh. ',
      description: 'External data description',
    },
    checkboxLabel: {
      id: 'doi.rpp.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'I understand',
    },
    submitButton: {
      id: 'doi.rpp.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  directorateOfImmigration: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.directorateOfImmigration.title',
      defaultMessage: 'Upplýsingar til Útlendingastofnunar',
      description: 'Directorate of immigration title',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.directorateOfImmigration.subTitle',
      defaultMessage:
        'Upplýsingar um núverandi dvalarleyfi þitt, maka og barna þinna ef við á',
      description: 'Directorate of immigration sub title',
    },
  }),
  icelandRevenueAndCustoms: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.icelandRevenueAndCustoms.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Iceland revenue and customs title',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.icelandRevenueAndCustoms.subTitle',
      defaultMessage: 'Upplýsingar um framfærslu þína',
      description: 'Iceland revenue and customs sub title',
    },
  }),
}
