import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'ef.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'ef.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'ef.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'ef.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'ef.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Staðfesta',
      description: 'External data submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'ef.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National Registry title',
    },
    subTitle: {
      id: 'ef.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ef.application:externalData.userProfile.title',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning úr þínum stillingum',
      description: 'User profile title',
    },
    subTitle: {
      id: 'ef.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile sub title',
    },
  }),
  financialManagementAuthority: defineMessages({
    title: {
      id: 'ef.application:externalData.financialManagementAuthority.title',
      defaultMessage: 'Upplýsingar frá Fjársýslunni',
      description: 'Financial Management Authority title',
    },
    subTitle: {
      id: 'ef.application:externalData.financialManagementAuthority.subTitle',
      defaultMessage: 'Um sögu styrkja',
      description: 'Financial Management Authority sub title',
    },
  }),
}
