import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:personal.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal section title',
    },
  }),
  labels: {
    userInformation: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:personal.labels.userInformation.subSectionTitle',
        defaultMessage: 'Notendaupplýsingar',
        description: 'User information sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:personal.labels.userInformation.pageTitle',
        defaultMessage: 'Notendaupplýsingar',
        description: 'User information page title',
      },
      description: {
        id: 'doi.cs.application:personal.labels.userInformation.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'User information description',
      },
      title: {
        id: 'doi.cs.application:personal.labels.userInformation.title',
        defaultMessage: 'Umsækjandi',
        description: 'User information title',
      },
      nationalId: {
        id: 'doi.cs.application:personal.labels.userInformation.nationalId',
        defaultMessage: 'Kennitala',
        description: 'User information national ID label',
      },
      name: {
        id: 'doi.cs.application:personal.labels.userInformation.name',
        defaultMessage: 'Nafn',
        description: 'User information name label',
      },
      address: {
        id: 'doi.cs.application:personal.labels.userInformation.address',
        defaultMessage: 'Heimilisfang',
        description: 'User information address label',
      },
      postalCodeAndCity: {
        id:
          'doi.cs.application:personal.labels.userInformation.postalCodeAndCity',
        defaultMessage: 'Staður',
        description: 'User information postal code and city label',
      },
      email: {
        id: 'doi.cs.application:personal.labels.userInformation.email',
        defaultMessage: 'Netfang',
        description: 'User information email label',
      },
      phone: {
        id: 'doi.cs.application:personal.labels.userInformation.phone',
        defaultMessage: 'Símanúmer',
        description: 'User information phone number label',
      },
    }),
    pickChildren: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:personal.labels.pickChildren.subSectionTitle',
        defaultMessage: 'Börn í þinni forsjá',
        description: 'Pick children sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:personal.labels.pickChildren.pageTitle',
        defaultMessage: 'Börn í þinni forsjá',
        description: 'Pick children page title',
      },
      description: {
        id: 'doi.cs.application:personal.labels.pickChildren.description',
        defaultMessage:
          'Interdum et malesuada fames ac ante ipsum primis in faucibus.',
        description: 'Pick children description',
      },
      title: {
        id: 'doi.cs.application:personal.labels.pickChildren.title',
        defaultMessage: 'Veldu börn',
        description: 'Pick children sub section title',
      },
    }),
  },
}
