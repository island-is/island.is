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
        id: 'doi.cs.application:personal.labels.userInformation.subSectionTitle',
        defaultMessage: 'Notendaupplýsingar',
        description: 'User information sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:personal.labels.userInformation.pageTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information page title',
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
      citizenship: {
        id: 'doi.cs.application:personal.labels.userInformation.citizenship',
        defaultMessage: 'Ríkisfang',
        description: 'User information citizenship label',
      },
      birthCountry: {
        id: 'doi.cs.application:personal.labels.userInformation.birthCountry',
        defaultMessage: 'Fæðingarland',
        description: 'User information birth country label',
      },
      residenceInIcelandLastChangeDate: {
        id: 'doi.cs.application:personal.labels.userInformation.residenceInIcelandLastChangeDate',
        defaultMessage: 'Dagsetning lögheimilisskráningar',
        description:
          'User information residence in Iceland last change date label',
      },
      residenceInIcelandLastChangeDateShorter: {
        id: 'doi.cs.application:personal.labels.userInformation.residenceInIcelandLastChangeDateShorter',
        defaultMessage: 'Dags. lögheimilisskráningar',
        description:
          'User information residence in Iceland last change date shorter label',
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
        id: 'doi.cs.application:personal.labels.userInformation.postalCodeAndCity',
        defaultMessage: 'Sveitarfélag',
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
  },
}
