import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:applicantInfo.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    title: {
      id: 'gfl.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    description: {
      id: 'gfl.application:applicantInfo.general.description',
      defaultMessage: `Vinsamlegast farið yfir eftirfarandi skráningu til að tryggja að allar upplýsingar séu réttar.  `,
      description: `Application information - description`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'gfl.application:applicantInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'gfl.application:applicantInfo.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'gfl.application:applicantInfo.labels.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'gfl.application:applicantInfo.abels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'gfl.application:applicantInfo.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'gfl.application:applicantInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'gfl.application:applicantInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    submitButton: {
      id: 'gfl.application:applicantInfo.labels.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'Continue to application',
    },
  }),
}
