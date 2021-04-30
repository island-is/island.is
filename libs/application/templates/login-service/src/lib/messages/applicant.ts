import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const applicant = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.applicant.pageTitle`,
      defaultMessage: 'Upplýsingar um umsækjanda',
      description: 'Applicant page title',
    },
    pageDescription: {
      id: `${t}:section.applicant.pageDescription`,
      defaultMessage:
        'Upplýsingar um þann lögaðila sem óskar eftir að nota innskráningarþjónustu Ísland.is',
      description: 'Applicant page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `${t}:section.applicant.name`,
      defaultMessage: 'Nafn á lögaðila',
      description: 'Applicant name label',
    },
    nameDescription: {
      id: `${t}:section.applicant.nameDescription`,
      defaultMessage: 'Lögaðili sem sækir um innskráningarþjónustu',
      description: 'Applicant name label description',
    },
    nationalId: {
      id: `${t}:section.applicant.nationalId`,
      defaultMessage: 'Kennitala lögaðila',
      description: 'Applicant national id label',
    },
    typeOfOperation: {
      id: `${t}:section.applicant.typeOfOperation`,
      defaultMessage: 'Rekstrartegund',
      description: 'Applicant type of operation label',
    },
    responsiblePartyTitle: {
      id: `${t}:section.applicant.responsiblePartyTitle`,
      defaultMessage: 'Ábyrgðaraðili',
      description: 'Applicant responsiblePartyTitle label',
    },
    responsiblePartyDescription: {
      id: `${t}:section.applicant.responsiblePartyDescription`,
      defaultMessage: 'Stuttur texti um hvað ábyrgðaraðili er',
      description: 'Applicant responsiblePartyDescription label',
    },
    responsiblePartyName: {
      id: `${t}:section.applicant.responsiblePartyName`,
      defaultMessage: 'Nafn á ábyrgðaraðila',
      description: 'Applicant responsiblePartyName label',
    },
    responsiblePartyEmail: {
      id: `${t}:section.applicant.responsiblePartyEmail`,
      defaultMessage: 'Netfang ábyrgðaraðila',
      description: 'Applicant responsiblePartyEmail label',
    },
    responsiblePartyTel: {
      id: `${t}:section.applicant.responsiblePartyTel`,
      defaultMessage: 'Símanúmer ábyrgðaraðila',
      description: 'Applicant responsiblePartyTel label',
    },
  }),
}
