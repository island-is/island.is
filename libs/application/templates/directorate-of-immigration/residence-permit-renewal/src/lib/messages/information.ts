import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
    sectionTitleWithPerson: {
      id: 'doi.rpr.application:information.general.sectionTitleWithPerson',
      defaultMessage: 'Upplýsingar - {person}',
      description: 'Information section title with person',
    },
  }),
  labels: {
    staysAbroad: defineMessages({
      subSectionTitle: {
        id:
          'doi.rpr.application:information.labels.staysAbroad.subSectionTitle',
        defaultMessage: 'Dvöl erlendis',
        description: 'Stays abroad sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.staysAbroad.pageTitle',
        defaultMessage: 'Dvöl erlendis á tímabilinu',
        description: 'Stays abroad page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.staysAbroad.description',
        defaultMessage:
          'Nam est arcu, pulvinar sed bibendum vel, volutpat id magna.',
        description: 'Stays abroad description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.staysAbroad.title',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, dvalið erlendis?',
        description: 'Stays abroad title',
      },
    }),
    criminalRecord: defineMessages({
      subSectionTitle: {
        id:
          'doi.rpr.application:information.labels.criminalRecord.subSectionTitle',
        defaultMessage: 'Sakaferill',
        description: 'Criminal record sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.criminalRecord.pageTitle',
        defaultMessage: 'Sakaferill',
        description: 'Criminal record page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.criminalRecord.description',
        defaultMessage:
          'Cras vestibulum iaculis nunc, sed lacinia nunc efficitur quis. Etiam sit amet nunc justo.',
        description: 'Criminal record description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.criminalRecord.title',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, sætt sektum, fangelsisrefsingum eða hefur þú stöðu grunaðs manns í lögreglurannsókn?',
        description: 'Criminal record title',
      },
    }),
    study: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.study.subSectionTitle',
        defaultMessage: 'Nám',
        description: 'Study sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.study.pageTitle',
        defaultMessage: 'Nám',
        description: 'Study page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.study.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Study description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.study.title',
        defaultMessage: 'Upplýsingar um nám',
        description: 'Study title',
      },
    }),
    employment: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.employment.subSectionTitle',
        defaultMessage: 'Atvinnuleyfi',
        description: 'Employment sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.employment.pageTitle',
        defaultMessage: 'Atvinnuleyfi',
        description: 'Employment page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.employment.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Employment description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.employment.title',
        defaultMessage: 'Upplýsingar um atvinnuleyfi',
        description: 'Employment title',
      },
    }),
    passport: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.passport.subSectionTitle',
        defaultMessage: 'Vegabréf',
        description: 'Passport sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.passport.pageTitle',
        defaultMessage: 'Fylgigögn - Vegabréf',
        description: 'Passport page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.passport.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Passport description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.passport.title',
        defaultMessage: 'Upplýsingar um vegabréf',
        description: 'Passport title',
      },
    }),
    otherDocuments: defineMessages({
      subSectionTitle: {
        id:
          'doi.rpr.application:information.labels.otherDocuments.subSectionTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.otherDocuments.pageTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.otherDocuments.description',
        defaultMessage:
          'Nunc vitae turpis faucibus, facilisis justo in, hendrerit odio.',
        description: 'Other documents description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.otherDocuments.title',
        defaultMessage: 'Test',
        description: 'Other documents title',
      },
    }),
  },
}
