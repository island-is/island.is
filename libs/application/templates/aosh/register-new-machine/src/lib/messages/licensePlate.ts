import { defineMessages } from 'react-intl'

export const licensePlate = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rnm.application:licensePlate.general.sectionTitle',
      defaultMessage: 'Skráning í umferð',
      description: 'Title of licensePlate screen',
    },
    title: {
      id: 'aosh.rnm.application:licensePlate.general.title',
      defaultMessage: 'Skráning í umferð',
      description: 'Title of licensePlate screen',
    },
    description: {
      id: 'aosh.rnm.application:licensePlate.general.description',
      defaultMessage: 'Skráðu viðeigandi upplýsingar. ',
      description: 'Description of licensePlate screen',
    },
    subTitle: {
      id: 'aosh.rnm.application:licensePlate.general.subTitle',
      defaultMessage: 'Á að sækja um skráningu í umferð?',
      description: 'Title of licensePlate subTitle',
    },
  }),
  labels: defineMessages({
    streetRegistration: {
      id: 'aosh.rnm.application:licensePlate.labels.streetRegistration',
      defaultMessage: 'Götuskráning',
      description: 'Label for street registration',
    },
    plateSize: {
      id: 'aosh.rnm.application:licensePlate.labels.plateSize',
      defaultMessage: 'Stærð merkis',
      description: 'Label for plate size',
    },
    plate110: {
      id: 'aosh.rnm.application:licensePlate.labels.plate110',
      defaultMessage: 'Stærð A (110x510cm)',
      description: 'Label for licence plate A',
    },
    plate200: {
      id: 'aosh.rnm.application:licensePlate.labels.plate200',
      defaultMessage: 'Stærð B (200x280cm)',
      description: 'Label for licence plate B',
    },
    plate155: {
      id: 'aosh.rnm.application:licensePlate.labels.plate155',
      defaultMessage: 'Stærð D (155x305cm)',
      description: 'Label for licence plate D',
    },
  }),
}
