import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    title: {
      id: 'uiForms.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'uiForms.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'uiForms.application:applicantInfo.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'uiForms.application:applicantInfo.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'uiForms.application:applicantInfo.abels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'uiForms.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'uiForms.application:applicantInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'uiForms.application:applicantInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
  error: defineMessages({
    phoneNumber: {
      id: 'uiForms.application:applicantInfo.error.phoneNumber',
      defaultMessage: 'Símanúmer verður að vera 7 stafir',
      description: 'Phone number must be 7 digits',
    },
    email: {
      id: 'uiForms.application:applicantInfo.error.email',
      defaultMessage: 'Netfang verður að vera gilt',
      description: 'Email must be valid',
    },
  }),
}
