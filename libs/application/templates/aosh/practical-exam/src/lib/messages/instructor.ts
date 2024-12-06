import { defineMessages } from 'react-intl'

export const instructor = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:instructor.general.pageTitle',
      defaultMessage: 'Leiðbeinendur',
      description: `instructor's page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:instructor.general.pageDescription',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: `instructor's page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:instructor.general.sectionTitle',
      defaultMessage: 'Leiðbeinendur',
      description: `instructor section title`,
    },
  }),
  tableRepeater: defineMessages({
    addInstructorButton: {
      id: 'aosh.pe.application:instructor.tableRepeater.addInstructorButton',
      defaultMessage: 'Skrá fleiri leiðbeinendur',
      description: `Text for the button to add another instructor`,
    },
    saveInstructorButton: {
      id: 'aosh.pe.application:instructor.tableRepeater.saveInstructorButton',
      defaultMessage: 'Vista',
      description: `Text for the button to save instructor`,
    },
  }),
}
