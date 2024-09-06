import { defineMessages } from 'react-intl'

export const licencePlate = {
  general: defineMessages({
    title: {
      id: 'aosh.sr.application:licencePlate.general.title',
      defaultMessage: 'Veldu stærð skráningarmerkis',
      description: 'Title of licencePlate screen',
    },
    description: {
      id: 'aosh.sr.application:licencePlate.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of licencePlate screen',
    },
    subTitle: {
      id: 'aosh.sr.application:licencePlate.general.subTitle',
      defaultMessage: 'Veldu stærð merkis',
      description: 'Title of licencePlate subTitle',
    },
    subTitleDescription: {
      id: 'aosh.sr.application:licencePlate.general.subTitleDescription',
      defaultMessage:
        'Vinnuvélamerki hafa dökkgulan flöt með endurskini með svarta rönd á brúnum og svarta stafi. Svartur upphleyptur tígullaga flötur er hægra megin við bókstafi.',
      description: 'Description of licencePlate subTitle',
    },
  }),
  labels: defineMessages({
    plate110: {
      id: 'aosh.sr.application:licencePlate.labels.plate110',
      defaultMessage: 'Stærð A (110x510cm)',
      description: 'Label for licence plate A',
    },
    plate200: {
      id: 'aosh.sr.application:licencePlate.labels.plate200',
      defaultMessage: 'Stærð B (200x280cm)',
      description: 'Label for licence plate B',
    },
    plate155: {
      id: 'aosh.sr.application:licencePlate.labels.plate155',
      defaultMessage: 'Stærð D (155x305cm)',
      description: 'Label for licence plate D',
    },
  }),
}
