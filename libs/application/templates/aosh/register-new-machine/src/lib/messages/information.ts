import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rnm.information:general.sectionTitle',
      defaultMessage: 'Nýskráning tækis {value}',
      description: `Application's name`,
    },
  }),
  labels: {
    importer: defineMessages({
      sectionTitle: {
        id: 'aosh.rnm.information:labels.sectionTitle',
        defaultMessage: 'Innflytjandi',
        description: `Importer section title`,
      },
      title: {
        id: 'aosh.rnm.information:labels.title',
        defaultMessage: 'Innflytjandi tækis',
        description: `Importer page title`,
      },
      description: {
        id: 'aosh.rnm.information:labels.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: `Importer page description`,
      },
      // subtitle: {
      //   id: 'aosh.rnm.information:labels.subtitle',
      //   defaultMessage: 'Innflytjandi tækis',
      //   description: `Importer page title`,
      // },
      name: {
        id: 'aosh.rnm.information:labels.name',
        defaultMessage: 'Nafn',
        description: `Importer name label`,
      },
      nationalId: {
        id: 'aosh.rnm.information:labels.nationalId',
        defaultMessage: 'Kennitala',
        description: `Importer nationalId label`,
      },
      address: {
        id: 'aosh.rnm.information:labels.address',
        defaultMessage: 'Heimilisfang',
        description: `Importer address label`,
      },
      postCode: {
        id: 'aosh.rnm.information:labels.postCode',
        defaultMessage: 'Póstnúmer',
        description: `Importer post code label`,
      },
      phone: {
        id: 'aosh.rnm.information:labels.phone',
        defaultMessage: 'Símanúmer',
        description: `Importer phone number label`,
      },
      email: {
        id: 'aosh.rnm.information:labels.email',
        defaultMessage: 'Netfang',
        description: `Importer email label`,
      },
    }),
  },
}
