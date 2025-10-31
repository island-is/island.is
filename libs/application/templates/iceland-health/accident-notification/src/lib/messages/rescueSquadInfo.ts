import { defineMessages } from 'react-intl'

export const rescueSquadInfo = {
  general: defineMessages({
    name: {
      id: 'an.application:rescueSquadInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:rescueSquadInfo.general.title',
      defaultMessage: 'Upplýsingar um björgunarsveit',
      description: 'Information about rescue squad',
    },
    description: {
      id: 'an.application:rescueSquadInfo.general.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um björgunarsveitina.',
      description: `Please fill in the details of the resuce squad with whom the injured person was working at the time of the accident.`,
    },
  }),
  labels: defineMessages({
    descriptionField: {
      id: 'an.application:rescueSquadInfo.labels.descriptionField',
      defaultMessage: 'Upplýsingar um forsvarsmann björgunarsveitar',
      description: `Information about the rescue squad's representative`,
    },
    subDescription: {
      id: 'an.application:rescueSquadInfo.labels.subDescription',
      defaultMessage:
        'Athugaðu að forsvarsmaður er sá aðili sem fer yfir tilkynninguna fyrir hönd björgunarsveitar.',
      description: `Sub description about the rescue squad's representative`,
    },
    nationalId: {
      id: 'an.application:rescueSquadInfo.labels.nationalId',
      defaultMessage: 'Kennitala björgunarsveitar',
      description: 'National ID of rescue squad',
    },
    name: {
      id: 'an.application:rescueSquadInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'an.application:rescueSquadInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:rescueSquadInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    checkBox: {
      id: 'an.application:rescueSquadInfo.labels.checkBox',
      defaultMessage:
        'Ég er forsvarsmaður björgunarsveitar þar sem slysið átti sér stað.',
      description:
        'I am a representative of the rescue squad where the accident took place.',
    },
  }),
}
