import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rnm.information:general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: `Application's name`,
    },
  }),
  labels: {
    importer: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.information:labels.importer.sectionTitle',
        defaultMessage: 'Innflytjandi',
        description: `Importer section title`,
      },
      title: {
        id: 'aosh.rnm.information:labels.importer.title',
        defaultMessage: 'Innflytjandi tækis',
        description: `Importer page title`,
      },
      description: {
        id: 'aosh.rnm.information:labels.importer.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: `Importer page description`,
      },
      isOwnerOtherThenImporter: {
        id: 'aosh.rnm.information:labels.importer.isOwnerOtherThenImporter',
        defaultMessage: 'Er eigandi annar en innflytjandi?',
        description: `Is owner other than importer question label`,
      },
      name: {
        id: 'aosh.rnm.information:labels.importer.name',
        defaultMessage: 'Nafn',
        description: `Importer name label`,
      },
      nationalId: {
        id: 'aosh.rnm.information:labels.importer.nationalId',
        defaultMessage: 'Kennitala',
        description: `Importer nationalId label`,
      },
      address: {
        id: 'aosh.rnm.information:labels.importer.address',
        defaultMessage: 'Heimilisfang',
        description: `Importer address label`,
      },
      postCode: {
        id: 'aosh.rnm.information:labels.importer.postCode',
        defaultMessage: 'Póstnúmer',
        description: `Importer post code label`,
      },
      phone: {
        id: 'aosh.rnm.information:labels.importer.phone',
        defaultMessage: 'Símanúmer',
        description: `Importer phone number label`,
      },
      email: {
        id: 'aosh.rnm.information:labels.importer.email',
        defaultMessage: 'Netfang',
        description: `Importer email label`,
      },
    }),
    otherOwner: defineMessages({
      name: {
        id: 'aosh.rnm.information:labels.otherOwner.name',
        defaultMessage: 'Nafn',
        description: `Importer name label`,
      },
      nationalId: {
        id: 'aosh.rnm.information:labels.otherOwner.nationalId',
        defaultMessage: 'Kennitala',
        description: `Importer nationalId label`,
      },
      address: {
        id: 'aosh.rnm.information:labels.otherOwner.address',
        defaultMessage: 'Heimilisfang',
        description: `Importer address label`,
      },
      postCode: {
        id: 'aosh.rnm.information:labels.potherOwner.ostCode',
        defaultMessage: 'Póstnúmer',
        description: `Importer post code label`,
      },
      phone: {
        id: 'aosh.rnm.information:labels.otherOwner.phone',
        defaultMessage: 'Símanúmer',
        description: `Importer phone number label`,
      },
      email: {
        id: 'aosh.rnm.information:labels.otherOwner.email',
        defaultMessage: 'Netfang',
        description: `Importer email label`,
      },
    }),
    radioButtons: defineMessages({
      radioOptionYes: {
        id: 'aosh.rnm.information.labels.radioButtons.radioYes',
        defaultMessage: 'Já',
        description: 'Yes option on radio button',
      },
      radioOptionNo: {
        id: 'aosh.rnm.information.labels.radioButtons.radioNo',
        defaultMessage: 'Nei',
        description: 'No option on radio button',
      },
    }),
  },
}
