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
      id: 'uiForms.application:applicantInfo.labels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'uiForms.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    postalCodeAndCity: {
      id: 'uiForms.application:applicantInfo.labels.postalCodeAndCity',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Postal Code and City',
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
    alertMessage: {
      id: 'uiForms.application:applicantInfo.labels.alertMessage',
      defaultMessage:
        'Ef netfang og símanúmer er ekki rétt hér að ofan þá verður að breyta þeim upplýsingum á mínum síðum Ísland.is og opna nýja umsókn.',
      description: 'Applicant alert message',
    },
    alertMessageLink: {
      id: 'uiForms.application:applicantInfo.labels.alertMessageLink',
      defaultMessage: '/minarsidur',
      description: 'Link for mínar síður',
    },
    alertMessageLinkTitle: {
      id: 'uiForms.application:applicantInfo.labels.alertMessageLinkTitle',
      defaultMessage: 'Fara á mínar síður',
      description: 'title for mínar síður link',
    },
  }),
  error: defineMessages({
    phoneNumber: {
      id: 'uiForms.application:applicantInfo.error.phoneNumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'Phone number is not valid',
    },
    email: {
      id: 'uiForms.application:applicantInfo.error.email',
      defaultMessage: 'Netfang verður að vera gilt',
      description: 'Email must be valid',
    },
  }),
}
