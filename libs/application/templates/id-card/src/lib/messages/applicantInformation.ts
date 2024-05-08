import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:applicantInformation.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Applicant information section title',
    },
    sectionDescription: {
      id: 'uni.application:applicantInformation.general.sectionDescription',
      defaultMessage:
        'Vinsamlegast farðu yfir eftirfarandi upplýsingar og gakktu úr skugga um að þær séu réttar.',
      description: 'Applicant information section description',
    },
  }),
  labels: {
    applicant: {
      id: 'uni.application:applicantInformation.labels.applicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant label',
    },
    parent: {
      id: 'uni.application:applicantInformation.labels.parent',
      defaultMessage: 'Forsjáraðili',
      description: 'Parent label',
    },
    applicantName: {
      id: 'uni.application:applicantInformation.labels.applicantName',
      defaultMessage: 'Nafn umsækjanda',
      description: 'applicant name label',
    },
    applicantNationalId: {
      id: 'uni.application:applicantInformation.labels.applicantNationalId',
      defaultMessage: 'Kennitala umsækjanda',
      description: 'applicant national id label',
    },
    applicantEmail: {
      id: 'uni.application:applicantInformation.labels.applicantEmail',
      defaultMessage: 'Netfang',
      description: 'applicant email label',
    },
    applicantPhoneNumber: {
      id: 'uni.application:applicantInformation.labels.applicantPhoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'applicant phone number label',
    },
  },
}
