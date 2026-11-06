import { defineMessages } from 'react-intl'

export const questionnaire = defineMessages({
  sectionTitle: {
    id: 'vmst.cjs.application:questionnaire.sectionTitle',
    defaultMessage: 'Spurningarlisti',
    description: 'Title of the questionnaire section and multi-field',
  },
  sectionStepTitle: {
    id: 'vmst.cjs.application:questionnaire.sectionStepTitle',
    defaultMessage: 'Spurningarlisti',
    description: 'Section step title of the questionnaire section',
  },
  alertInfoTitle: {
    id: 'vmst.cjs.application:questionnaire.alertInfoTitle',
    defaultMessage: 'Þú ert að staðfesta atvinnuleit í þriðja sinn',
    description: 'alert info title above questionnaire section',
  },
  alertInfoMessage: {
    id: 'vmst.cjs.application:questionnaire.alertInfoMessage',
    defaultMessage:
      'Til þess að tryggja viðeigandi ráðgjöf í atvinnuleitinni þarf að svara nokkrum spurningum áður en þú getur staðfest atvinnuleitina.',
    description: 'alert info message above questionnaire section',
  },
  requiredAnswerError: {
    id: 'vmst.cjs.application:questionnaire.requiredAnswerError',
    defaultMessage: 'Þessari spurningu þarf að svara',
    description: 'Error shown on a required question that has no answer',
  },
})
