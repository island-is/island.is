import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ra.application:application.name',
    defaultMessage: 'Leigusamningur',
    description: `Name of rental agreement application`,
  },
})

export const section = defineMessages({
  information: {
    id: 'ra.application:section.information',
    defaultMessage: 'Upplýsingar',
    description: 'Information about the rental agreement',
  },
})

export const information = {
  general: defineMessages({
    pageageTitle: {
      id: 'ra.application:information.general.sectionTitle',
      defaultMessage: 'Almennt',
      description: 'General information section title',
    },
  }),
}

export const applicantInfo = {
  general: defineMessages({
    title: {
      id: 'ra.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um leigjanda',
      description: 'Information about the applicant',
    },
  }),
}
