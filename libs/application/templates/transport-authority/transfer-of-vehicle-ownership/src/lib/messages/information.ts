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
      title: {
        id: 'ta.tvo.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki til eigendaskipta',
        description: 'Pick vehicle title',
      },
      vehicle: {
        id: 'ta.tvo.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      isStolenTag: {
        id: 'ta.tvo.application:information.labels.pickVehicle.isStolenTag',
        defaultMessage: 'Bifreið stolin',
        description: 'Pick vehicle is stolen tag',
      },
      hasEncumbrancesTag: {
        id:
          'ta.tvo.application:information.labels.pickVehicle.hasEncumbrancesTag',
        defaultMessage: 'Ógreidd bifreiðagjöld',
        description: 'Pick vehicle has encumbrances tag',
      },
    }),
    vehicle: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.vehicle.title',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle title',
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
    }),
    seller: defineMessages({
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
      phone: {
        id: 'ta.tvo.application:information.labels.seller.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.seller.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
    }),
    coOwner: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.coOwner.title',
        defaultMessage: 'Meðeigandi',
        description: 'Co-owner title',
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
      phone: {
        id: 'ta.tvo.application:information.labels.coOwner.phone',
        defaultMessage: 'Gsm númer',
        description: 'Co-owner phone number label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.coOwner.email',
        defaultMessage: 'Netfang',
        description: 'Co-owner email label',
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
    }),
    operator: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.operator.title',
        defaultMessage: 'Umráðamaður',
        description: 'Operator title',
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
    }),
    buyer: defineMessages({
      title: {
        id: 'ta.tvo.application:information.labels.buyer.title',
        defaultMessage: 'Kaupandi',
        description: 'Buyer title',
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
      phone: {
        id: 'ta.tvo.application:information.labels.buyer.phone',
        defaultMessage: 'Gsm númer',
        description: 'Buyer phone number label',
      },
      email: {
        id: 'ta.tvo.application:information.labels.buyer.email',
        defaultMessage: 'Netfang',
        description: 'Buyer email label',
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
        id:
          'ta.tvo.application:information.labels.mainOperator.radioFieldLabel',
        defaultMessage: 'Skráðir umráðamenn',
        description: 'Main operator radio field label',
      },
    }),
  },
}
