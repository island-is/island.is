import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'hst.application:general.name',
      defaultMessage: 'Umsókn um heimastuðning',
      description: 'Home support application',
    },
  }),
  applicant: defineMessages({
    infoSectionTitle: {
      id: 'hst.applicant.information:section.title',
      defaultMessage: 'Upplýsingar um mig',
      description: 'Applicant information section title',
    },
    legalDomicilePersonsSectionTitle: {
      id: 'hst.applicant.legalDomicilePersons:section.title',
      defaultMessage: 'Skráðir á lögheimili',
      description: 'Legal domicile persons section title',
    },
  }),
}
