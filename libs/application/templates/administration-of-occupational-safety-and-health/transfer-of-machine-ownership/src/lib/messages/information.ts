import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosah.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'aosah.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'aosah.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'aosah.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine section title',
      },
      title: {
        id: 'aosah.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu tæki til eigendaskipta',
        description: 'Pick machine title',
      },
      description: {
        id: 'aosah.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Pick machine description',
      },
      vehicle: {
        id: 'aosah.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Tæki',
        description: 'Pick machine label',
      },
      placeholder: {
        id: 'aosah.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine placeholder',
      },
      hasErrorTitle: {
        id: 'aosah.application:information.labels.pickVehicle.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að selja þessa bifreið vegna:',
        description: 'Pick machine has an error title',
      },
      isNotDebtLessTag: {
        id: 'aosah.application:information.labels.pickVehicle.isNotDebtLessTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick machine is not debt less tag',
      },
    }),
    vehicle: defineMessages({
      sectionTitle: {
        id: 'aosah.application:information.labels.vehicle.sectionTitle',
        defaultMessage: 'Tæki',
        description: 'Machine section title',
      },
      title: {
        id: 'aosah.application:information.labels.vehicle.title',
        defaultMessage: 'Tæki',
        description: 'Machine title',
      },
      description: {
        id: 'aosah.application:information.labels.vehicle.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Machine description',
      },
      plate: {
        id: 'aosah.application:information.labels.vehicle.plate',
        defaultMessage: 'Númer tækis',
        description: 'Machine plate number label',
      },
      type: {
        id: 'aosah.application:information.labels.vehicle.type',
        defaultMessage: 'Tegund',
        description: 'Machine type label',
      },
      salePrice: {
        id: 'aosah.application:information.labels.vehicle.salePrice',
        defaultMessage: 'Söluverð (kr.)',
        description: 'Sale price for vehicle label',
      },
      purchasePrice: {
        id: 'aosah.application:information.labels.vehicle.purchasePrice',
        defaultMessage: 'Kaupverð (kr.)',
        description: 'Purchase price for vehicle label',
      },
      date: {
        id: 'aosah.application:information.labels.vehicle.date',
        defaultMessage: 'Dagsetning kaupsamnings',
        description: 'Date of purchase agreement label',
      },
    }),
    seller: defineMessages({
      sectionTitle: {
        id: 'aosah.application:information.labels.seller.sectionTitle',
        defaultMessage: 'Seljandi',
        description: 'Seller section title',
      },
      title: {
        id: 'aosah.application:information.labels.seller.title',
        defaultMessage: 'Seljandi',
        description: 'Seller title',
      },
      subtitle: {
        id: 'aosah.application:information.labels.seller.subtitle',
        defaultMessage: 'Aðaleigandi',
        description: 'Main owner title',
      },
      description: {
        id: 'aosah.application:information.labels.seller.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Seller description',
      },
      nationalId: {
        id: 'aosah.application:information.labels.seller.nationalId',
        defaultMessage: 'Kennitala seljanda',
        description: 'Seller national ID label',
      },
      name: {
        id: 'aosah.application:information.labels.seller.name',
        defaultMessage: 'Nafn seljanda',
        description: 'Seller name label',
      },
      email: {
        id: 'aosah.application:information.labels.seller.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
      phone: {
        id: 'aosah.application:information.labels.seller.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
    }),
    coOwner: defineMessages({
      title: {
        id: 'aosah.application:information.labels.coOwner.title',
        defaultMessage: 'Meðeigandi',
        description: 'Co-owner title',
      },
      description: {
        id: 'aosah.application:information.labels.coOwner.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'CoOwner description',
      },
      nationalId: {
        id: 'aosah.application:information.labels.coOwner.nationalId',
        defaultMessage: 'Kennitala meðeiganda',
        description: 'Co-owner national ID label',
      },
      name: {
        id: 'aosah.application:information.labels.coOwner.name',
        defaultMessage: 'Nafn meðeiganda',
        description: 'Co-owner name label',
      },
      email: {
        id: 'aosah.application:information.labels.coOwner.email',
        defaultMessage: 'Netfang',
        description: 'Co-owner email label',
      },
      phone: {
        id: 'aosah.application:information.labels.coOwner.phone',
        defaultMessage: 'Gsm númer',
        description: 'Co-owner phone number label',
      },
      remove: {
        id: 'aosah.application:information.labels.coOwner.remove',
        defaultMessage: 'Fjarlægja meðeiganda',
        description: 'Co-owner remove label',
      },
      add: {
        id: 'aosah.application:information.labels.coOwner.add',
        defaultMessage: 'Bæta við meðeiganda',
        description: 'Co-owner add label',
      },
      error: {
        id: 'aosah.application:information.labels.coOwner.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Co-owner error message',
      },
    }),
    operator: defineMessages({
      title: {
        id: 'aosah.application:information.labels.operator.title',
        defaultMessage: 'Umráðamaður',
        description: 'Operator title',
      },
      description: {
        id: 'aosah.application:information.labels.operator.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Operator description',
      },
      nationalId: {
        id: 'aosah.application:information.labels.operator.nationalId',
        defaultMessage: 'Kennitala umráðamanns',
        description: 'Operator national ID label',
      },
      name: {
        id: 'aosah.application:information.labels.operator.name',
        defaultMessage: 'Nafn umráðamanns',
        description: 'Operator name label',
      },
      email: {
        id: 'aosah.application:information.labels.operator.email',
        defaultMessage: 'Netfang',
        description: 'Operator email label',
      },
      phone: {
        id: 'aosah.application:information.labels.operator.phone',
        defaultMessage: 'Gsm númer',
        description: 'Operator phone number label',
      },
      remove: {
        id: 'aosah.application:information.labels.operator.remove',
        defaultMessage: 'Fjarlægja umráðamann',
        description: 'Operator remove label',
      },
      add: {
        id: 'aosah.application:information.labels.operator.add',
        defaultMessage: 'Bæta við umráðamanni',
        description: 'Operator add label',
      },
      main: {
        id: 'aosah.application:information.labels.operator.main',
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
        id: 'aosah.application:information.labels.buyer.sectionTitle',
        defaultMessage: 'Kaupandi',
        description: 'Buyer section title',
      },
      title: {
        id: 'aosah.application:information.labels.buyer.title',
        defaultMessage: 'Kaupandi',
        description: 'Buyer title',
      },
      description: {
        id: 'aosah.application:information.labels.buyer.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Buyer description',
      },
      nationalId: {
        id: 'aosah.application:information.labels.buyer.nationalId',
        defaultMessage: 'Kennitala kaupanda',
        description: 'Buyer national ID label',
      },
      name: {
        id: 'aosah.application:information.labels.buyer.name',
        defaultMessage: 'Nafn kaupanda',
        description: 'Buyer name label',
      },
      email: {
        id: 'aosah.application:information.labels.buyer.email',
        defaultMessage: 'Netfang',
        description: 'Buyer email label',
      },
      phone: {
        id: 'aosah.application:information.labels.buyer.phone',
        defaultMessage: 'Gsm númer',
        description: 'Buyer phone number label',
      },
    }),
    coOwnersAndOperators: defineMessages({
      title: {
        id: 'aosah.application:information.labels.coOwnersAndOperators.title',
        defaultMessage: 'Meðeigandi / umráðamaður',
        description: 'Coowners and operators title',
      },
      description: {
        id: 'aosah.application:information.labels.coOwnersAndOperators.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: 'Coowners and operators description',
      },
      approveButton: {
        id: 'aosah.application:information.labels.coOwnersAndOperators.approveButton',
        defaultMessage: 'Staðfesta',
        description: 'Approve button for coOwners and operators',
      },
    }),
    mainOperator: defineMessages({
      sectionTitle: {
        id: 'aosah.application:information.labels.mainOperator.sectionTitle',
        defaultMessage: 'Umráðamaður',
        description: 'Main operator section title',
      },
      title: {
        id: 'aosah.application:information.labels.mainOperator.title',
        defaultMessage: 'Veldu aðal-umráðamann',
        description: 'Main operator title',
      },
      description: {
        id: 'aosah.application:information.labels.mainOperator.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: 'Main operator description',
      },
      radioFieldLabel: {
        id: 'aosah.application:information.labels.mainOperator.radioFieldLabel',
        defaultMessage: 'Skráðir umráðamenn',
        description: 'Main operator radio field label',
      },
    }),
  },
}
