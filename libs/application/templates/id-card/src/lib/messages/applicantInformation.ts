import { defineMessages } from 'react-intl'

export const applicantInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:applicantInformation.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Applicant information section title',
    },
    sectionDescription: {
      id: 'id.application:applicantInformation.general.sectionDescription',
      defaultMessage:
        'Vinsamlegast farðu yfir eftirfarandi upplýsingar og gakktu úr skugga um að þær séu réttar.',
      description: 'Applicant information section description',
    },
  }),
  labels: {
    applicant: {
      id: 'id.application:applicantInformation.labels.applicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant label',
    },
    parent: {
      id: 'id.application:applicantInformation.labels.parent',
      defaultMessage: 'Forsjáraðili',
      description: 'Parent label',
    },
    applicantName: {
      id: 'id.application:applicantInformation.labels.applicantName',
      defaultMessage: 'Nafn umsækjanda',
      description: 'applicant name label',
    },
    applicantNationalId: {
      id: 'id.application:applicantInformation.labels.applicantNationalId',
      defaultMessage: 'Kennitala umsækjanda',
      description: 'applicant national id label',
    },
    applicantEmail: {
      id: 'id.application:applicantInformation.labels.applicantEmail',
      defaultMessage: 'Netfang',
      description: 'applicant email label',
    },
    applicantPhoneNumber: {
      id: 'id.application:applicantInformation.labels.applicantPhoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'applicant phone number label',
    },
    name: {
      id: 'id.application:applicantInformation.labels.name',
      defaultMessage: 'Nafn',
      description: 'name label',
    },
    nationalId: {
      id: 'id.application:applicantInformation.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'national id label',
    },
    hasDisabilityDiscount: {
      id: 'id.application:applicantInformation.labels.hasDisabilityDiscount',
      defaultMessage:
        'Ég er handhafi örorkuskírteinis og vil láta fletta upp örorkuskírteini mínu hjá Tryggingastofnun fyrir lægra gjald á vegabréfi.',
      description: 'Some description',
    },
    noDisabiltiyRecordInfoMessage: {
      id: 'id.application:applicantInformation.labels.noDisabiltiyRecordInfoMessage',
      defaultMessage: 'Þú ert ekki handhafi örorkuskírteinis',
      description: 'Some description',
    },
    disabiltiyRecordInfoMessage: {
      id: 'id.application:applicantInformation.labels.disabiltiyRecordInfoMessage',
      defaultMessage: 'Þú ert handhafi örorkuskírteinis',
      description: 'Some description',
    },
    disabiltiyRecordError: {
      id: 'id.application:applicantInformation.labels.disabiltiyRecordError',
      defaultMessage:
        'Eitthvað fór úrskeiðis við að ná sambandi, vinsamlegast reyndu aftur síðar',
      description: 'Some description',
    },
  },
}
