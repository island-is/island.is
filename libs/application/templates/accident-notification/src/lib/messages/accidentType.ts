import { defineMessages } from 'react-intl'

export const accidentType = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:accidentType.sectionTitle',
      defaultMessage: 'Aðstæður slys',
      description: 'Accident circumstances',
    },
    heading: {
      id: 'an.application:accidentType.heading',
      defaultMessage: 'Við hvaða aðstæður varð slysið?',
      description: 'Under what circumstances did the accident occur?',
    },
    description: {
      id: 'an.application:accidentType.description',
      defaultMessage: `Vinsamlegast veldu þann slysaflokk sem lýsir best aðstæðum slyssins. `,
      description:
        'Please select the category of accident that best describes the situation of the accident.',
    },
  }),
  labels: defineMessages({
    homeActivites: {
      id: 'an.application:accidentType.labels.homeActivites',
      defaultMessage: 'Heimlisstörf',
      description: 'Home activites',
    },
    work: {
      id: 'an.application:accidentType.labels.work',
      defaultMessage: 'Vinnu',
      description: 'Work',
    },
    rescueWork: {
      id: 'an.application:accidentType.labels.work',
      defaultMessage: 'Björgunarstörf',
      description: 'Rescue Work',
    },
    studies: {
      id: 'an.application:accidentType.labels.work',
      defaultMessage: 'Nám',
      description: 'Studies',
    },
    sports: {
      id: 'an.application:accidentType.labels.work',
      defaultMessage: 'Íþróttaiðkun',
      description: 'Sport activites',
    },
  }),
}
