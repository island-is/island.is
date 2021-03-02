import { defineMessages } from 'react-intl'

// Confirmation
export const info = {
  general: defineMessages({
    pageTitle: {
      id: 'dcap.application:section.info.pageTitle',
      defaultMessage: 'Fyrir hvern ertu að senda inn kvörtun?',
      description: 'Info page title',
    },
    description: {
      id: 'dcap.application:section.info.description',
      defaultMessage: 'Vantar textaupplýsingar',
      description: 'Info page description',
    },
  }),
  labels: defineMessages({
    myself: {
      id: 'dcap.application:section.info.myself',
      defaultMessage: 'Mig',
      description: 'Myself',
    },
    myselfAndOrOthers: {
      id: 'dcap.application:section.info.myselfAndOrOthers',
      defaultMessage: 'Mig ásamt öðrum í umboði',
      description: 'Myself and others',
    },
    company: {
      id: 'dcap.application:section.info.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Company',
    },
    organizationInstitution: {
      id: 'dcap.application:section.info.organizationInstitution',
      defaultMessage: 'Félagasamtök / stofnun',
      description: 'Organization or institution',
    },
  }),
}
