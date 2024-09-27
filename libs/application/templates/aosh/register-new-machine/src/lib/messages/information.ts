import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rnm.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: `Application's name`,
    },
  }),
  labels: {
    importer: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:information.labels.importer.sectionTitle',
        defaultMessage: 'Innflytjandi',
        description: `Importer section title`,
      },
      title: {
        id: 'aosh.rnm.application:information.labels.importer.title',
        defaultMessage: 'Innflytjandi tækis',
        description: `Importer page title`,
      },
      description: {
        id: 'aosh.rnm.application:information.labels.importer.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: `Importer page description`,
      },
      name: {
        id: 'aosh.rnm.application:information.labels.importer.name',
        defaultMessage: 'Nafn',
        description: `Importer name label`,
      },
      nationalId: {
        id: 'aosh.rnm.application:information.labels.importer.nationalId',
        defaultMessage: 'Kennitala',
        description: `Importer nationalId label`,
      },
      address: {
        id: 'aosh.rnm.application:information.labels.importer.address',
        defaultMessage: 'Heimilisfang',
        description: `Importer address label`,
      },
      postCode: {
        id: 'aosh.rnm.application:information.labels.importer.postCode',
        defaultMessage: 'Póstnúmer',
        description: `Importer post code label`,
      },
      phone: {
        id: 'aosh.rnm.application:information.labels.importer.phone',
        defaultMessage: 'Símanúmer',
        description: `Importer phone number label`,
      },
      email: {
        id: 'aosh.rnm.application:information.labels.importer.email',
        defaultMessage: 'Netfang',
        description: `Importer email label`,
      },
    }),
    owner: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:information.labels.owner.sectionTitle',
        defaultMessage: 'Eigandi',
        description: `Owner section title`,
      },
      title: {
        id: 'aosh.rnm.application:information.labels.otherOwner.title',
        defaultMessage: 'Eigandi',
        description: `Owner title label`,
      },
      description: {
        id: 'aosh.rnm.application:information.labels.owner.description',
        defaultMessage: 'Skráðu viðeigandi upplýsingar',
        description: `Owner page description`,
      },
      isOwnerOtherThenImporter: {
        id: 'aosh.rnm.application:information.labels.owner.isOwnerOtherThenImporter',
        defaultMessage: 'Er eigandi annar en innflytjandi?',
        description: `Is owner other than importer question label`,
      },
      name: {
        id: 'aosh.rnm.application:information.labels.otherOwner.name',
        defaultMessage: 'Nafn',
        description: `Owner name label`,
      },
      nationalId: {
        id: 'aosh.rnm.application:information.labels.otherOwner.nationalId',
        defaultMessage: 'Kennitala',
        description: `Owner nationalId label`,
      },
      address: {
        id: 'aosh.rnm.application:information.labels.otherOwner.address',
        defaultMessage: 'Heimilisfang',
        description: `Owner address label`,
      },
      postCode: {
        id: 'aosh.rnm.application:information.labels.otherOwner.ostCode',
        defaultMessage: 'Póstnúmer',
        description: `Owner post code label`,
      },
      phone: {
        id: 'aosh.rnm.application:information.labels.otherOwner.phone',
        defaultMessage: 'Símanúmer',
        description: `Owner phone number label`,
      },
      email: {
        id: 'aosh.rnm.application:information.labels.otherOwner.email',
        defaultMessage: 'Netfang',
        description: `Owner email label`,
      },
      alertTitle: {
        id: 'aosh.rnm.application:information.labels.otherOwner.alertTitle',
        defaultMessage: 'Kennitala sú sama og hjá innflytjanda',
        description: `Owner alert title`,
      },
      alertMessage: {
        id: 'aosh.rnm.application:information.labels.otherOwner.alertMessage',
        defaultMessage:
          'Kennitalan sem þú skráðir fyrir eiganda er sú sama og hjá innflytjanda, vertu viss um að þú hafir skráð inn rétta kennitölu.',
        description: `Owner alert message`,
      },
    }),
    operator: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.application:information.labels.operator.sectionTitle',
        defaultMessage: 'Umráðamaður',
        description: `Operator section title`,
      },
      title: {
        id: 'aosh.rnm.application:information.labels.operator.title',
        defaultMessage: 'Umráðamaður',
        description: `Operator page title`,
      },
      description: {
        id: 'aosh.rnm.application:information.labels.operator.description',
        defaultMessage: 'Skráðu viðeigandi upplýsingar',
        description: `Operator page description`,
      },
      hasOperator: {
        id: 'aosh.rnm.application:information.labels.operator.hasOperator',
        defaultMessage: 'Á að skrá umráðamann?',
        description: `Is there an operator`,
      },
      name: {
        id: 'aosh.rnm.application:information.labels.operator.name',
        defaultMessage: 'Nafn',
        description: `Operator name label`,
      },
      nationalId: {
        id: 'aosh.rnm.application:information.labels.operator.nationalId',
        defaultMessage: 'Kennitala',
        description: `Operator nationalId label`,
      },
      address: {
        id: 'aosh.rnm.application:information.labels.operator.address',
        defaultMessage: 'Heimilisfang',
        description: `Operator address label`,
      },
      postCode: {
        id: 'aosh.rnm.application:information.labels.operator.postCode',
        defaultMessage: 'Póstnúmer',
        description: `Operator post code label`,
      },
      phone: {
        id: 'aosh.rnm.application:information.labels.operator.phone',
        defaultMessage: 'Símanúmer',
        description: `Operator phone number label`,
      },
      email: {
        id: 'aosh.rnm.application:information.labels.operator.email',
        defaultMessage: 'Netfang',
        description: `Operator email label`,
      },
      alertTitle: {
        id: 'aosh.rnm.application:information.labels.operator.alertTitle',
        defaultMessage: 'Kennitala sú sama og hjá eiganda',
        description: `Operator alert title`,
      },
      alertMessage: {
        id: 'aosh.rnm.application:information.labels.operator.alertMessage',
        defaultMessage:
          'Kennitalan sem þú skráðir fyrir umráðarmann er sú sama og hjá eiganda, vertu viss um að þú hafir skráð inn rétta kennitölu.',
        description: `Operator alert message`,
      },
    }),
    radioButtons: defineMessages({
      radioOptionYes: {
        id: 'aosh.rnm.application:information.labels.radioButtons.radioYes',
        defaultMessage: 'Já',
        description: 'Yes option on radio button',
      },
      radioOptionNo: {
        id: 'aosh.rnm.application:information.labels.radioButtons.radioNo',
        defaultMessage: 'Nei',
        description: 'No option on radio button',
      },
    }),
  },
}
