import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:applicant.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant section',
    },
    pageTitle: {
      id: 'ta.dtdc.application:applicant.general.pageTitle',
      defaultMessage: 'Upplýsingar um umsækjanda',
      description: 'Title of applicant page',
    },
  }),
  labels: {
    userInformation: defineMessages({
      subSectionTitle: {
        id:
          'ta.dtdc.application:applicant.labels.userInformation.subSectionTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information sub section title',
      },
    }),
    cardDelivery: defineMessages({
      subSectionTitle: {
        id: 'ta.dtdc.application:applicant.labels.cardDelivery.subSectionTitle',
        defaultMessage: 'Afhending korts',
        description: 'Card delivery sub section title',
      },
    }),
  },
}
