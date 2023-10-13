import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:personal.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal section title',
    },
  }),
  labels: {
    userInformation: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:personal.labels.userInformation.subSectionTitle',
        defaultMessage: 'Notendaupplýsingar',
        description: 'User information sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:personal.labels.userInformation.pageTitle',
        defaultMessage: 'Notendaupplýsingar',
        description: 'User information page title',
      },
      description: {
        id: 'doi.rpr.application:personal.labels.userInformation.description',
        defaultMessage: ' ',
        description: 'User information description',
      },
      title: {
        id: 'doi.rpr.application:personal.labels.userInformation.title',
        defaultMessage: 'Umsækjandi',
        description: 'User information title',
      },
      nationalId: {
        id: 'doi.rpr.application:personal.labels.userInformation.nationalId',
        defaultMessage: 'Kennitala',
        description: 'User information national ID label',
      },
      name: {
        id: 'doi.rpr.application:personal.labels.userInformation.name',
        defaultMessage: 'Nafn',
        description: 'User information name label',
      },
      address: {
        id: 'doi.rpr.application:personal.labels.userInformation.address',
        defaultMessage: 'Heimilisfang',
        description: 'User information address label',
      },
      postalCodeAndCity: {
        id: 'doi.rpr.application:personal.labels.userInformation.postalCodeAndCity',
        defaultMessage: 'Staður',
        description: 'User information postal code and city label',
      },
      email: {
        id: 'doi.rpr.application:personal.labels.userInformation.email',
        defaultMessage: 'Netfang',
        description: 'User information email label',
      },
      phone: {
        id: 'doi.rpr.application:personal.labels.userInformation.phone',
        defaultMessage: 'Símanúmer',
        description: 'User information phone number label',
      },
      securityPinTitle: {
        id: 'doi.rpr.application:personal.labels.userInformation.securityPinTitle',
        defaultMessage:
          'Vinsamlegast veldu öryggistölu fyrir umsóknina (gildir um alla umsækjendur sem verið er að sækja um fyrir)',
        description: 'User information security pin title',
      },
      securityPin: {
        id: 'doi.rpr.application:personal.labels.userInformation.securityPin',
        defaultMessage: 'Öryggisnúmer',
        description: 'User information security pin label',
      },
      securityPinPlaceholder: {
        id: 'doi.rpr.application:personal.labels.userInformation.securityPinPlaceholder',
        defaultMessage: '(4 tölustafir)',
        description: 'User information security pin placeholder',
      },
    }),
    maritalStatus: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.subSectionTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.pageTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status page title',
      },
      description: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.description',
        defaultMessage:
          'Nulla facilisi. Curabitur vitae iaculis ligula. Mauris nec tristique nisi. Proin et augue ac lorem faucibus scelerisque.',
        description: 'Marital status description',
      },
      titleStatus: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.titleStatus',
        defaultMessage: 'Hjúskaparstaða þín',
        description: 'Marital status title status',
      },
      titleSpouse: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.titleSpouse',
        defaultMessage: 'Maki þinn',
        description: 'Marital status title spouse',
      },
      status: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.status',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status label',
      },
      nationalId: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.nationalId',
        defaultMessage: 'Kennitala maka',
        description: 'Marital status national ID label',
      },
      name: {
        id: 'doi.rpr.application:personal.labels.maritalStatus.name',
        defaultMessage: 'Nafn maka',
        description: 'Marital status name label',
      },
    }),
  },
}
