import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.tvo.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.tvo.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'ta.tvo.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ta.tvo.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ta.tvo.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki til eigendaskipta',
        description: 'Pick vehicle title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Pick vehicle description',
      },
      vehicle: {
        id: 'ta.tvo.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ta.tvo.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      hasErrorTitle: {
        id: 'ta.tvo.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að selja þessa bifreið vegna:',
        description: 'Pick vehicle has an error title',
      },
      isNotDebtLessTag: {
        id: 'ta.tvo.application:information.labels.pickVehicle.isNotDebtLessTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick vehicle is not debt less tag',
      },
    }),
    vehicle: defineMessages({
      sectionTitle: {
        id: 'ta.tvo.application:information.labels.vehicle.sectionTitle',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle section title',
      },
      title: {
        id: 'ta.tvo.application:information.labels.vehicle.title',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.vehicle.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Vehicle description',
      },
      plate: {
        id: 'ta.tvo.application:information.labels.vehicle.plate',
        defaultMessage: 'Númer ökutækis',
        description: 'Vehicle plate number label',
      },
      type: {
        id: 'ta.tvo.application:information.labels.vehicle.type',
        defaultMessage: 'Tegund ökutækis',
        description: 'Vehicle type label',
      },
      salePrice: {
        id: 'ta.tvo.application:information.labels.vehicle.salePrice',
        defaultMessage: 'Söluverð (kr.)',
        description: 'Sale price for vehicle label',
      },
      purchasePrice: {
        id: 'ta.tvo.application:information.labels.vehicle.purchasePrice',
        defaultMessage: 'Kaupverð (kr.)',
        description: 'Purchase price for vehicle label',
      },
      date: {
        id: 'ta.tvo.application:information.labels.vehicle.date',
        defaultMessage: 'Dagsetning kaupsamnings',
        description: 'Date of purchase agreement label',
      },
      mileage: {
        id: 'ta.tvo.application:information.labels.vehicle.mileage',
        defaultMessage: 'Kílómetrar',
        description: 'Mileage for vehicle label',
      },
    }),
    seller: defineMessages({
      sectionTitle: {
        id: 'ta.tvo.application:information.labels.seller.sectionTitle',
        defaultMessage: 'Seljandi',
        description: 'Seller section title',
      },
      title: {
        id: 'ta.tvo.application:information.labels.seller.title',
        defaultMessage: 'Seljandi',
        description: 'Seller title',
      },
      subtitle: {
        id: 'ta.tvo.application:information.labels.seller.subtitle',
        defaultMessage: 'Aðaleigandi',
        description: 'Main owner title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.seller.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Seller description',
      },
      nationalId: {
        id: 'ta.tvo.application:information.labels.seller.nationalId',
        defaultMessage: 'Kennitala seljanda',
        description: 'Seller national ID label',
      },
      name: {
        id: 'ta.tvo.application:information.labels.seller.name',
        defaultMessage: 'Nafn seljanda',
        description: 'Seller name label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.seller.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
      phone: {
        id: 'ta.tvo.application:information.labels.seller.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
    }),
    coOwner: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.coOwner.title',
        defaultMessage: 'Meðeigandi',
        description: 'Co-owner title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.coOwner.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'CoOwner description',
      },
      nationalId: {
        id: 'ta.tvo.application:information.labels.coOwner.nationalId',
        defaultMessage: 'Kennitala meðeiganda',
        description: 'Co-owner national ID label',
      },
      name: {
        id: 'ta.tvo.application:information.labels.coOwner.name',
        defaultMessage: 'Nafn meðeiganda',
        description: 'Co-owner name label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.coOwner.email',
        defaultMessage: 'Netfang',
        description: 'Co-owner email label',
      },
      phone: {
        id: 'ta.tvo.application:information.labels.coOwner.phone',
        defaultMessage: 'Gsm númer',
        description: 'Co-owner phone number label',
      },
      remove: {
        id: 'ta.tvo.application:information.labels.coOwner.remove',
        defaultMessage: 'Fjarlægja meðeiganda',
        description: 'Co-owner remove label',
      },
      add: {
        id: 'ta.tvo.application:information.labels.coOwner.add',
        defaultMessage: 'Bæta við meðeiganda',
        description: 'Co-owner add label',
      },
      error: {
        id: 'ta.tvo.application:information.labels.coOwner.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Co-owner error message',
      },
    }),
    operator: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.operator.title',
        defaultMessage: 'Umráðamaður',
        description: 'Operator title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.operator.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Operator description',
      },
      nationalId: {
        id: 'ta.tvo.application:information.labels.operator.nationalId',
        defaultMessage: 'Kennitala umráðamanns',
        description: 'Operator national ID label',
      },
      name: {
        id: 'ta.tvo.application:information.labels.operator.name',
        defaultMessage: 'Nafn umráðamanns',
        description: 'Operator name label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.operator.email',
        defaultMessage: 'Netfang',
        description: 'Operator email label',
      },
      phone: {
        id: 'ta.tvo.application:information.labels.operator.phone',
        defaultMessage: 'Gsm númer',
        description: 'Operator phone number label',
      },
      remove: {
        id: 'ta.tvo.application:information.labels.operator.remove',
        defaultMessage: 'Fjarlægja umráðamann',
        description: 'Operator remove label',
      },
      add: {
        id: 'ta.tvo.application:information.labels.operator.add',
        defaultMessage: 'Bæta við umráðamanni',
        description: 'Operator add label',
      },
      main: {
        id: 'ta.tvo.application:information.labels.operator.main',
        defaultMessage: 'aðal',
        description: 'Main label - for main operator',
      },
      identicalError: {
        id: 'ta.cov.application:information.labels.operator.identicalError',
        defaultMessage: 'Það má ekki nota sömu kennitölu tvisvar',
        description: 'operator identical error',
      },
    }),
    buyer: defineMessages({
      sectionTitle: {
        id: 'ta.tvo.application:information.labels.buyer.sectionTitle',
        defaultMessage: 'Kaupandi',
        description: 'Buyer section title',
      },
      title: {
        id: 'ta.tvo.application:information.labels.buyer.title',
        defaultMessage: 'Kaupandi',
        description: 'Buyer title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.buyer.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Buyer description',
      },
      nationalId: {
        id: 'ta.tvo.application:information.labels.buyer.nationalId',
        defaultMessage: 'Kennitala kaupanda',
        description: 'Buyer national ID label',
      },
      name: {
        id: 'ta.tvo.application:information.labels.buyer.name',
        defaultMessage: 'Nafn kaupanda',
        description: 'Buyer name label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.buyer.email',
        defaultMessage: 'Netfang',
        description: 'Buyer email label',
      },
      phone: {
        id: 'ta.tvo.application:information.labels.buyer.phone',
        defaultMessage: 'Gsm númer',
        description: 'Buyer phone number label',
      },
    }),
    coOwnersAndOperators: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.coOwnersAndOperators.title',
        defaultMessage: 'Meðeigandi / umráðamaður',
        description: 'Coowners and operators title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.coOwnersAndOperators.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: 'Coowners and operators description',
      },
      approveButton: {
        id: 'ta.tvo.application:information.labels.coOwnersAndOperators.approveButton',
        defaultMessage: 'Staðfesta',
        description: 'Approve button for coOwners and operators',
      },
    }),
    mainOperator: defineMessages({
      sectionTitle: {
        id: 'ta.tvo.application:information.labels.mainOperator.sectionTitle',
        defaultMessage: 'Umráðamaður',
        description: 'Main operator section title',
      },
      title: {
        id: 'ta.tvo.application:information.labels.mainOperator.title',
        defaultMessage: 'Veldu aðal-umráðamann',
        description: 'Main operator title',
      },
      description: {
        id: 'ta.tvo.application:information.labels.mainOperator.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: 'Main operator description',
      },
      radioFieldLabel: {
        id: 'ta.tvo.application:information.labels.mainOperator.radioFieldLabel',
        defaultMessage: 'Skráðir umráðamenn',
        description: 'Main operator radio field label',
      },
    }),
  },
}
