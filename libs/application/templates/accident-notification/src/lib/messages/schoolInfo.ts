import { defineMessages } from 'react-intl'

export const schoolInfo = {
  general: defineMessages({
    name: {
      id: 'an.application:schoolInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:schoolInfo.general.title',
      defaultMessage: 'Upplýsingar um skóla',
      description: 'Information about school',
    },
    description: {
      id: 'an.application:schoolInfo.general.description',
      defaultMessage: 'Vinsamlegast fylltu út upplýsingar um skólann þinn.',
      description: `Please fill in the details of the school with whom the injured person was working at the time of the accident.`,
    },
  }),
  labels: defineMessages({
    descriptionField: {
      id: 'an.application:schoolInfo.labels.descriptionField',
      defaultMessage: 'Upplýsingar um forsvarsmann skóla',
      description: `Information about the school's representative`,
    },
    subDescription: {
      id: 'an.application:schoolInfo.labels.subDescription',
      defaultMessage:
        'Athugaðu að forsvarsmaður er sá aðili sem fer yfir tilkynninguna fyrir hönd skóla.',
      description: `Sub description about the school's representative`,
    },
    nationalId: {
      id: 'an.application:schoolInfo.labels.nationalId',
      defaultMessage: 'Kennitala skóla',
      description: 'National ID of school',
    },
    name: {
      id: 'an.application:schoolInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'an.application:schoolInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:schoolInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    checkBox: {
      id: 'an.application:schoolInfo.labels.checkBox',
      defaultMessage:
        'Ég er forsvarsmaður hjá skóla þar sem slysið átti sér stað.',
      description:
        'I am a representative of the school where the accident took place.',
    },
  }),
}
