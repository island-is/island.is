import { defineMessages } from 'react-intl'

export const selectCompany = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.selectCompany.pageTitle`,
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Applicant page title',
    },
    pageDescription: {
      id: `ls.application:section.selectCompany.pageDescription`,
      defaultMessage:
        'Upplýsingar um þann lögaðila sem óskar eftir að nota innskráningarþjónustu Ísland.is',
      description: 'Applicant page description',
    },
  }),
  labels: defineMessages({
    nameDescription: {
      id: `ls.application:section.selectCompany.nameDescription`,
      defaultMessage: 'Lögaðili sem sækir um innskráningarþjónustu',
      description: 'Applicant name label description',
    },
    nameAndNationalId: {
      id: `ls.application:section.selectCompany.nameAndNationalId`,
      defaultMessage: 'Leitaðu eftir nafni eða kennitölu hjá opinberum aðila',
      description: 'Applicant name and national id label',
    },
  }),
}
