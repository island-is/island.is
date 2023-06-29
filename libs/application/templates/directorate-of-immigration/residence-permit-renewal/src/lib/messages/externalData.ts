import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    description: {
      id: 'doi.rpr.application:externalData.dataProvider.description',
      defaultMessage:
        'Upplýsingar um þig kunna að vera notaðar við vinnslu seinni umsókna og/eða umsókna fjölskyldumeðlima til að tryggja að upplýsingar séu réttar. Á gildistíma dvalarleyfis kann Útlendingastofnun að taka gögn þín til skoðunar berist upplýsingar um breyttar aðstæður eða gildi gagna.',
      description: 'External data description',
    },
    subTitle2: {
      id: 'doi.rpr.application:externalData.dataProvider.subTitle2',
      defaultMessage:
        'Eftirfarandi gögn verða sótt rafrænt af Útlendingastofnun',
      description: 'External data sub title 2',
    },
    checkboxLabel: {
      id: 'doi.rpr.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'doi.rpr.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
    },
  }),
  directorateOfImmigration: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.directorateOfImmigration.title',
      defaultMessage: 'Upplýsingar til Útlendingastofnunar',
      description: 'Directorate of immigration title',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.directorateOfImmigration.subTitle',
      defaultMessage:
        'Upplýsingar um núverandi dvalarleyfi þitt, maka og barna þinna ef við á',
      description: 'Directorate of immigration sub title',
    },
  }),
  icelandRevenueAndCustoms: defineMessages({
    title: {
      id: 'doi.rpr.application:externalData.icelandRevenueAndCustoms.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Iceland revenue and customs title',
    },
    subTitle: {
      id: 'doi.rpr.application:externalData.icelandRevenueAndCustoms.subTitle',
      defaultMessage: 'Upplýsingar um framfærslu þína, ef við á.',
      description: 'Iceland revenue and customs sub title',
    },
  }),
}
