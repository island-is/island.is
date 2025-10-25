import { defineMessages } from 'react-intl'

export const sportsClubInfo = {
  general: defineMessages({
    name: {
      id: 'an.application:sportsClubInfo.general.name',
      defaultMessage: 'Slysatilkynning til Sjúkratryggingar Íslands ',
      description: 'Accident notification to Sjúkratryggingar Íslands',
    },
    title: {
      id: 'an.application:sportsClubInfo.general.title',
      defaultMessage: 'Upplýsingar um íþróttafélag',
      description: 'Information about sports club',
    },
    description: {
      id: 'an.application:sportsClubInfo.general.description',
      defaultMessage: 'Vinsamlegast fylltu út upplýsingar um íþróttafélagið.',
      description: `Please fill in the details of the sports club with whom the injured person was working at the time of the accident.`,
    },
  }),
  employee: defineMessages({
    sectionTitle: {
      id: 'an.application:sportsClubInfo.employee.sectionTitle',
      defaultMessage: 'Launþegi hjá íþróttafélagi',
      description: `Title of sports club employee section.`,
    },
    title: {
      id: 'an.application:sportsClubInfo.employee.title',
      defaultMessage: 'Þiggur hinn slasaði greiðslur frá íþróttafélaginu?',
      description: `Title of sports club employee section.`,
    },
  }),
  labels: defineMessages({
    descriptionField: {
      id: 'an.application:sportsClubInfo.labels.descriptionField',
      defaultMessage: 'Upplýsingar um forsvarsmann íþróttafélags',
      description: `Information about the sports club's representative`,
    },
    subDescription: {
      id: 'an.application:sportsClubInfo.labels.subDescription',
      defaultMessage:
        'Athugaðu að forsvarsmaður er sá aðili sem fer yfir tilkynninguna fyrir hönd íþróttafélags.',
      description: `Sub description about the sports club's representative`,
    },
    nationalId: {
      id: 'an.application:sportsClubInfo.labels.nationalId',
      defaultMessage: 'Kennitala íþróttafélags',
      description: 'National ID of sports club',
    },
    name: {
      id: 'an.application:sportsClubInfo.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'an.application:sportsClubInfo.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:sportsClubInfo.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    checkBox: {
      id: 'an.application:sportsClubInfo.labels.checkBox',
      defaultMessage:
        'Ég er forsvarsmaður íþróttafélags þar sem slysið átti sér stað.',
      description:
        'I am a representative of the sports club where the accident took place.',
    },
  }),
}
