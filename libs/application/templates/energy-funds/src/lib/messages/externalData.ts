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
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'National Registry sub title',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'ef.application:externalData.userProfile.title',
      defaultMessage: 'Upplýsingar frá mínum sínum Ísland.is',
      description: 'User profile title',
    },
    subTitle: {
      id: 'ef.application:externalData.userProfile.subTitle',
      defaultMessage: 'Upplýsingar um bankareikning úr þínum stillingum',
      description: 'User profile sub title',
    },
  }),
  transportAuthority: defineMessages({
    title: {
      id: 'ef.application:externalData.transportAuthority.title',
      defaultMessage:
        'Upplýsingar um rafbifreiðar í þinni eigu og stöðu þeirra',
      description: 'transport authority title',
    },
    subTitle: {
      id: 'ef.application:externalData.transportAuthority.subTitle',
      defaultMessage:
        'Upplýsingar úr ökutækjaskrá  - Upplýsingar um þínar bifreiðar og stöðu þeirra',
      description: 'transport authority sub title',
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
