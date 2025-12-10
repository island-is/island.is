import { defineMessages } from 'react-intl'

export const userInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:userInformation.general.sectionTitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Title of user information section',
    },
  }),
  applicant: defineMessages({
    subSectionTitle: {
      id: 'ta.eft.application:userInformation.applicant.subSectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant sub section',
    },
    pageTitle: {
      id: 'ta.eft.application:userInformation.applicant.pageTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of applicant page',
    },
    subtitle: {
      id: 'ta.eft.application:userInformation.applicant.subtitle',
      defaultMessage: 'Innskráður aðili',
      description: 'Applicant subtitle',
    },
  }),
  transporter: defineMessages({
    subSectionTitle: {
      id: 'ta.eft.application:userInformation.transporter.subSectionTitle',
      defaultMessage: 'Flutningsaðili',
      description: 'Title of transporter sub section',
    },
    pageTitle: {
      id: 'ta.eft.application:userInformation.transporter.pageTitle',
      defaultMessage: 'Flutningsaðili',
      description: 'Title of transporter page',
    },
    subtitle: {
      id: 'ta.eft.application:userInformation.transporter.subtitle',
      defaultMessage: 'Flutningsaðili',
      description: 'Transporter subtitle',
    },
    isSameAsApplicant: {
      id: 'ta.eft.application:userInformation.transporter.isSameAsApplicant',
      defaultMessage: 'Flutningsaðili er sá sami og innskráður aðili',
      description: 'Transporter is same as applicant checkbox text',
    },
    nationalId: {
      id: 'ta.eft.application:userInformation.transporter.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Transporter national id',
    },
    name: {
      id: 'ta.eft.application:userInformation.transporter.name',
      defaultMessage: 'Nafn',
      description: 'Transporter name',
    },
    email: {
      id: 'ta.eft.application:userInformation.transporter.email',
      defaultMessage: 'Netfang',
      description: 'Transporter email',
    },
    phone: {
      id: 'ta.eft.application:userInformation.transporter.phone',
      defaultMessage: 'Símanúmer',
      description: 'Transporter phone',
    },
  }),
  responsiblePerson: defineMessages({
    subtitle: {
      id: 'ta.eft.application:userInformation.responsiblePerson.subtitle',
      defaultMessage: 'Ábyrgðarmaður flutnings',
      description: 'Responsible person subtitle',
    },
    isSameAsApplicant: {
      id: 'ta.eft.application:userInformation.responsiblePerson.isSameAsApplicant',
      defaultMessage: 'Ábyrgðarmaður er sá sami og innskráður aðili',
      description: 'Responsible person is same as applicant checkbox text',
    },
    nationalId: {
      id: 'ta.eft.application:userInformation.responsiblePerson.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Responsible person national id',
    },
    name: {
      id: 'ta.eft.application:userInformation.responsiblePerson.name',
      defaultMessage: 'Nafn',
      description: 'Responsible person name',
    },
    email: {
      id: 'ta.eft.application:userInformation.responsiblePerson.email',
      defaultMessage: 'Netfang',
      description: 'Responsible person email',
    },
    phone: {
      id: 'ta.eft.application:userInformation.responsiblePerson.phone',
      defaultMessage: 'Símanúmer',
      description: 'Responsible person phone',
    },
  }),
}
