import { defineMessages } from 'react-intl'

export const questionnaire = defineMessages({
  sectionTitle: {
    id: 'vmst.cjs.application:questionnaire.sectionTitle',
    defaultMessage: 'Staðfesta atvinnuleit',
    description: 'Title of the questionnaire section and multi-field',
  },
  sectionStepTitle: {
    id: 'vmst.cjs.application:questionnaire.sectionStepTitle',
    defaultMessage: 'Atvinnuleit',
    description: 'Section step title of the questionnaire section',
  },
  multiFieldDescription: {
    id: 'vmst.cjs.application:questionnaire.multiFieldDescription',
    defaultMessage:
      'Hér fyrir neðan geturðu skráð þau störf sem þú sóttir um í mánuðinum.',
    description: 'Description shown below the questionnaire section title',
  },
})
