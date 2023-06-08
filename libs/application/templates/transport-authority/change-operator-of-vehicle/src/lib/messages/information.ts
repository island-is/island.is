import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.cov.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.cov.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
  }),
  labels: {
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ta.cov.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ta.cov.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle title',
      },
      description: {
        id: 'ta.cov.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Hér að neðan er listi yfir ökutæki í þinni eigu. Veldu það ökutæki sem þú ætlar að bæta við/fella niður umráðamann á',
        description: 'Pick vehicle description',
      },
      vehicle: {
        id: 'ta.cov.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ta.cov.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      hasErrorTitle: {
        id: 'ta.cov.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að selja þessa bifreið vegna:',
        description: 'Pick vehicle has an error title',
      },
      isNotDebtLessTag: {
        id: 'ta.cov.application:information.labels.pickVehicle.isNotDebtLessTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick vehicle is not debt less tag',
      },
    }),
    owner: defineMessages({
      sectionTitle: {
        id: 'ta.cov.application:information.labels.owner.sectionTitle',
        defaultMessage: 'Eigandi',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ta.cov.application:information.labels.owner.title',
        defaultMessage: 'Eigandi',
        description: 'Seller title',
      },
      subtitle: {
        id: 'ta.cov.application:information.labels.owner.subtitle',
        defaultMessage: 'Aðaleigandi',
        description: 'Main owner title',
      },
      description: {
        id: 'ta.cov.application:information.labels.owner.description',
        defaultMessage: ' ',
        description: 'Seller description',
      },
      nationalId: {
        id: 'ta.cov.application:information.labels.owner.nationalId',
        defaultMessage: 'Kennitala eiganda',
        description: 'Seller national ID label',
      },
      name: {
        id: 'ta.cov.application:information.labels.owner.name',
        defaultMessage: 'Nafn eiganda',
        description: 'Seller name label',
      },
      email: {
        id: 'ta.cov.application:information.labels.owner.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
      phone: {
        id: 'ta.cov.application:information.labels.owner.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
    }),
    coOwner: defineMessages({
      title: {
        id: 'ta.cov.application:information.labels.coOwner.title',
        defaultMessage: 'Meðeigandi',
        description: 'Co-owner title',
      },
      nationalId: {
        id: 'ta.cov.application:information.labels.coOwner.nationalId',
        defaultMessage: 'Kennitala meðeiganda',
        description: 'Co-owner national ID label',
      },
      name: {
        id: 'ta.cov.application:information.labels.coOwner.name',
        defaultMessage: 'Nafn meðeiganda',
        description: 'Co-owner name label',
      },
      email: {
        id: 'ta.cov.application:information.labels.coOwner.email',
        defaultMessage: 'Netfang',
        description: 'Co-owner email label',
      },
      phone: {
        id: 'ta.cov.application:information.labels.coOwner.phone',
        defaultMessage: 'Gsm númer',
        description: 'Co-owner phone number label',
      },
      error: {
        id: 'ta.cov.application:information.labels.coOwner.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Co-owner error message',
      },
    }),
    operator: defineMessages({
      sectionTitle: {
        id: 'ta.cov.application:information.labels.operator.sectionTitle',
        defaultMessage: 'Umráðamaður',
        description: 'Operator section title',
      },
      title: {
        id: 'ta.cov.application:information.labels.operator.title',
        defaultMessage: 'Upplýsingar um umráðamenn',
        description: 'Operator title',
      },
      description: {
        id: 'ta.cov.application:information.labels.operator.description',
        defaultMessage: '  ',
        description: 'Operator description',
      },
      operatorTitle: {
        id: 'ta.cov.application:information.labels.operator.operatorTitle',
        defaultMessage: 'Umráðamaður',
        description: 'Operator operatorTitle',
      },
      operatorTempTitle: {
        id: 'ta.cov.application:information.labels.operator.operatorTempTitle',
        defaultMessage: 'Nýr umráðamaður',
        description: 'Operator temp title',
      },
      nationalId: {
        id: 'ta.cov.application:information.labels.operator.nationalId',
        defaultMessage: 'Kennitala umráðamanns',
        description: 'Operator national ID label',
      },
      name: {
        id: 'ta.cov.application:information.labels.operator.name',
        defaultMessage: 'Nafn umráðamanns',
        description: 'Operator name label',
      },
      email: {
        id: 'ta.cov.application:information.labels.operator.email',
        defaultMessage: 'Netfang',
        description: 'Operator email label',
      },
      phone: {
        id: 'ta.cov.application:information.labels.operator.phone',
        defaultMessage: 'Gsm númer',
        description: 'Operator phone number label',
      },
      remove: {
        id: 'ta.cov.application:information.labels.operator.remove',
        defaultMessage: 'Fjarlægja umráðamann',
        description: 'Operator remove label',
      },
      add: {
        id: 'ta.cov.application:information.labels.operator.add',
        defaultMessage: 'Bæta við umráðamanni',
        description: 'Operator add label',
      },
      main: {
        id: 'ta.cov.application:information.labels.operator.main',
        defaultMessage: 'aðal',
        description: 'Main label - for main operator',
      },
      error: {
        id: 'ta.cov.application:information.labels.operator.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Operator error message',
      },
      identicalError: {
        id: 'ta.cov.application:information.labels.operator.identicalError',
        defaultMessage: 'Það má ekki nota sömu kennitölu tvisvar',
        description: 'operator identical error',
      },
    }),
    mainOperator: defineMessages({
      sectionTitle: {
        id: 'ta.cov.application:information.labels.mainOperator.sectionTitle',
        defaultMessage: 'Umráðamaður',
        description: 'Main operator section title',
      },
      title: {
        id: 'ta.cov.application:information.labels.mainOperator.title',
        defaultMessage: 'Veldu aðal-umráðamann',
        description: 'Main operator title',
      },
      description: {
        id: 'ta.cov.application:information.labels.mainOperator.description',
        defaultMessage: ' ',
        description: 'Main operator description',
      },
      radioFieldLabel: {
        id: 'ta.cov.application:information.labels.mainOperator.radioFieldLabel',
        defaultMessage: 'Skráðir umráðamenn',
        description: 'Main operator radio field label',
      },
    }),
  },
}
