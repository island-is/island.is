import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'ghb.application:general.name',
      defaultMessage: 'Kaup á íbúðarhúsnæði í Grindavík',
      description: 'Grindavik Housing Buyout application name',
    },
    submit: {
      id: 'ghb.application:general.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application button text',
    },
  }),
  applicant: defineMessages({
    infoSectionTitle: {
      id: 'ghb.applicant.information:section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant information section title',
    },
  }),
}
