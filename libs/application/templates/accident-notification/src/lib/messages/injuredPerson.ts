import { defineMessages } from 'react-intl'

export const injuredPerson = {
  general: defineMessages({
    title: {
      id: 'an.application:overview.labels.injuredInformation',
      defaultMessage: 'Upplýsingar um þann slasaða',
      description: 'Information about the injured person',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'an.application:injuredPerson.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Name of injured person',
    },
    nationalId: {
      id: 'an.application:injuredPerson.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID of injured person',
    },
    address: {
      id: 'an.application:injuredPerson.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address of injured person',
    },
    postalCode: {
      id: 'an.application:injuredPerson.labels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code of injured person',
    },
    city: {
      id: 'an.application:injuredPerson.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City of injured person',
    },
    email: {
      id: 'an.application:injuredPerson.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email of injured person',
    },
    phoneNumber: {
      id: 'an.application:injuredPerson.labels.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number of injured person',
    },
  }),
}
