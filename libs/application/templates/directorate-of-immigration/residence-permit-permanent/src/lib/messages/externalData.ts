import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'External data sub title',
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
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'doi.rpp.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'doi.rpp.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'doi.rpp.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
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
