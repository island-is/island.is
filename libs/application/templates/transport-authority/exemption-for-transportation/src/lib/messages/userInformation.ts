import { defineMessages } from 'react-intl'

export const userInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:userInformation.general.sectionTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of user information section',
    },
    pageTitle: {
      id: 'ta.eft.application:userInformation.general.pageTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of user information page',
    },
  }),
  applicant: defineMessages({
    subtitle: {
      id: 'ta.eft.application:userInformation.applicant.subtitle',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant subtitle',
    },
  }),
}
