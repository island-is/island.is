import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'mcar.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'mcar.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'mcar.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External data sub title',
    },
    checkboxLabel: {
      id: 'mcar.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'External data checkbox label',
    },
    submitButton: {
      id: 'mcar.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Staðfesta',
      description: 'External data submit button',
    },
  }),
  transportAuthority: defineMessages({
    title: {
      id: 'mcar.application:externalData.transportAuthority.title',
      defaultMessage: 'Upplýsingar um bifreiðar í þinni eigu',
      description: 'transport authority title',
    },
    subTitle: {
      id: 'mcar.application:externalData.transportAuthority.subTitle',
      defaultMessage:
        'Upplýsingar úr ökutækjaskrá - Upplýsingar um þínar bifreiðar og stöðu þeirra',
      description: 'transport authority sub title',
    },
  }),
}
