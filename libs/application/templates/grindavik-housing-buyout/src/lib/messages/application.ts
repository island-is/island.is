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
    sectionTitle: {
      id: 'ghb.application.applicant:section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant information section title',
    },
  }),
  propertyInformation: defineMessages({
    sectionTitle: {
      id: 'ghb.application.propertyInformation:section.title',
      defaultMessage: 'Upplýsingar um eign',
      description: 'Property information section title',
    },
    sectionDescription: {
      id: 'ghb.application.propertyInformation:section.description',
      defaultMessage:
        'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að.',
      description: 'Property information section description',
    },
  }),
  loanStatus: defineMessages({
    sectionTitle: {
      id: 'ghb.application.loanStatus:section.title',
      defaultMessage: 'Staða á láni',
      description: 'Loan status section title',
    },
    sectionDescription: {
      id: 'ghb.application.loanStatus:section.description',
      defaultMessage:
        'Hér getur þú bætt við upplýsingum um stöðu á láni fasteignar.',
      description: 'Loan status section description',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'ghb.application.overview:section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    sectionDescription: {
      id: 'ghb.application.overview:section.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Overview section description',
    },
  }),
}
