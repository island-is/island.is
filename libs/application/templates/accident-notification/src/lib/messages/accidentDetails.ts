import { defineMessages } from 'react-intl'

export const accidentDetails = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:accidentDetails.general.sectionTitle',
      defaultMessage: 'Lýsing á slysi',
      description: 'Description of accident',
    },
    description: {
      id: 'an.application:accidentDetails.general.description',
      defaultMessage:
        'Vinsamlegast gerðu grein fyrir dagsetningu og tíma slyss, tildrögum-, orsökum- og aðstæðum slyssins.',
      description:
        'Please state the date and time of the accident, the cause, cause and circumstances of the accident.',
    },
  }),
  labels: defineMessages({
    date: {
      id: 'an.application:accidentDetails.labels.date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    time: {
      id: 'an.application:accidentDetails.labels.time',
      defaultMessage: 'Tími',
      description: 'Time',
    },
    description: {
      id: 'an.application:accidentDetails.labels.description',
      defaultMessage: 'Ýtarleg lýsing á slysi',
      description: 'Description of accident',
    },
  }),
  placeholder: defineMessages({
    date: {
      id: 'an.application:accidentDetails.placeholder.date',
      defaultMessage: 'Veldu dagsetning',
      description: 'Choose a date',
    },
    time: {
      id: 'an.application:accidentDetails.placeholder.time',
      defaultMessage: 'Sláðu inn tíma slyssins',
      description: 'Enter the time of the accident',
    },
    description: {
      id: 'an.application:accidentDetails.placeholder.description',
      defaultMessage: 'Skrifaðu hér tildrög, orsök og aðstæður slyssins',
      description:
        'Write here the outline, cause and circumstances of the accident',
    },
  }),
}
