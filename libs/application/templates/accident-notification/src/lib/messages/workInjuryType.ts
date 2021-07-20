import { defineMessages } from 'react-intl'

export const workInjuryType = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:workInjuryType.sectionTitle',
      defaultMessage: 'Vinnuslys',
      description: 'Work accident',
    },
    description: {
      id: 'an.application:workInjuryType.description',
      defaultMessage:
        'Allir launþegar án tillits til aldurs, sem starfa hér á landi. Starf um borð í skipi eða loftfari, íslensku eða sem gert er út eða rekið af íslenskum aðilum jafngildir starfi hér á landi ef laun eru greidd hér á landi eru slysatryggðir.  Veldu slysaflokk hér að neðan sem á við.',
      description:
        'All employees, regardless of age, who work in this country. Work on board a ship or aircraft, Icelandic or that is carried out or operated by Icelandic parties, is equivalent to work in this country if wages are paid in this country are insured against accidents. Select the appropriate accident category below.',
    },
  }),
  labels: defineMessages({
    general: {
      id: 'an.application:workInjuryType.labels.general',
      defaultMessage: 'Almennt vinnuslys á landi',
      description: 'General work accident',
    },
    fisherman: {
      id: 'an.application:workInjuryType.labels.fisherman',
      defaultMessage: 'Vinnuslys sjómanna',
      description: 'Accident during work as a fisherman',
    },
    athlete: {
      id: 'an.application:workInjuryType.labels.athlete',
      defaultMessage: 'Atvinnumennska í íþróttum',
      description: 'Accident during work as an athlete',
    },
    farmer: {
      id: 'an.application:workInjuryType.labels.farmer',
      defaultMessage: 'Slys við landbúnað',
      description: 'Accident during agriculture work',
    },
  }),
}
