import { defineMessages } from 'react-intl'

export const supportingDocuments = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:supportingDocuments.general.sectionTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Supporting documents section title',
    },
    sectionTitleWithPerson: {
      id:
        'doi.cs.application:supportingDocuments.general.sectionTitleWithPerson',
      defaultMessage: 'Fylgigögn - {person}',
      description: 'Supporting documents section title with person',
    },
  }),
  labels: {
    passport: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:supportingDocuments.labels.passport.subSectionTitle',
        defaultMessage: 'Vegabréf',
        description: 'Passport sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.pageTitle',
        defaultMessage: 'Fylgigögn - Vegabréf',
        description: 'Passport page title',
      },
      description: {
        id:
          'doi.cs.application:supportingDocuments.labels.passport.description',
        defaultMessage:
          'Nam est arcu, pulvinar sed bibendum vel, volutpat id magna.',
        description: 'Passport description',
      },
      title: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.title',
        defaultMessage: 'Upplýsingar um vegabréf',
        description: 'Passport title',
      },
    }),
    otherDocuments: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:supportingDocuments.labels.otherDocuments.subSectionTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents sub section title',
      },
      pageTitle: {
        id:
          'doi.cs.application:supportingDocuments.labels.otherDocuments.pageTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents page title',
      },
      description: {
        id:
          'doi.cs.application:supportingDocuments.labels.otherDocuments.description',
        defaultMessage:
          'Nam est arcu, pulvinar sed bibendum vel, volutpat id magna.',
        description: 'Other documents description',
      },
      title: {
        id:
          'doi.cs.application:supportingDocuments.labels.otherDocuments.title',
        defaultMessage: 'Vinsamlegast hlaðið inn eftirfarandi fylgigögnum.',
        description: 'Other documents title',
      },
    }),
  },
}
