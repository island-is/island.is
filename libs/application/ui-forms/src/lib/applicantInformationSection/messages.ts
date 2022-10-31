import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    title: {
      id: 'ais.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'ais.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'ais.application:applicantInfo.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'ais.application:applicantInfo.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'ais.application:applicantInfo.abels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'ais.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'ais.application:applicantInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'ais.application:applicantInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
}
