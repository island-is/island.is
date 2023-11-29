import { defineMessages } from 'react-intl'

export const supportingDocuments = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:supportingDocuments.general.sectionTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Supporting documents section title',
    },
    sectionTitleWithPerson: {
      id: 'doi.cs.application:supportingDocuments.general.sectionTitleWithPerson',
      defaultMessage: 'Fylgigögn - {person}',
      description: 'Supporting documents section title with person',
    },
    description: {
      id: 'doi.cs.application:supportingDocuments.general.description',
      defaultMessage: 'Upplýsingar fyrir {person}',
      description: 'general description',
    },
  }),
  labels: {
    passport: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.subSectionTitle',
        defaultMessage: 'Vegabréf',
        description: 'Passport sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.pageTitle',
        defaultMessage: 'Fylgigögn - Vegabréf',
        description: 'Passport page title',
      },
      title: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.title',
        defaultMessage: 'Upplýsingar um vegabréf',
        description: 'Passport title',
      },
      publishDate: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.publishDate',
        defaultMessage: 'Útáfudagur',
        description: 'Publish date label',
      },
      expirationDate: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.expirationDate',
        defaultMessage: 'Gildistími',
        description: 'Expiration Date label',
      },
      passportNumber: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.passportNumber',
        defaultMessage: 'Númer vegabréfs',
        description: 'Passport Number label',
      },
      passportType: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.passportType',
        defaultMessage: 'Tegund vegabréfs',
        description: 'Passport Type label',
      },
      publisher: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.publisher',
        defaultMessage: 'Útgefandi',
        description: 'Passport publisher label',
      },
      fileUpload: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.fileUpload',
        defaultMessage: 'Afrit af vegabréfi',
        description: 'passport file upload title',
      },
      datePlaceholder: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.publishDatePlaceholder',
        defaultMessage: 'Veldu dagsetningu',
        description: 'Date placeholder',
      },
      numberPlaceholder: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.numberPlaceholder',
        defaultMessage: '0123456789',
        description: 'Number placeholder',
      },
      typePlaceholder: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.typePlaceholder',
        defaultMessage: 'Veldu tegund',
        description: 'Type placeholder',
      },
      uploadTitlePlaceholder: {
        id: 'doi.cs.application:supportingDocuments.labels.passport.uploadTitlePlaceholder',
        defaultMessage: 'Afrit af vegabréfi',
        description: 'Upload title placeholder',
      },
    }),
    otherDocuments: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.subSectionTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.pageTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents page title',
      },
      description: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.description',
        defaultMessage:
          'Nam est arcu, pulvinar sed bibendum vel, volutpat id magna.',
        description: 'Other documents description',
      },
      title: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.title',
        defaultMessage: 'Vinsamlegast hlaðið inn eftirfarandi fylgigögnum.',
        description: 'Other documents title',
      },
      birthCertificate: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.birthCertificate',
        defaultMessage:
          'Fæðingarvottorð (ef sótt um sem barn ísl. ríkisborgara)',
        description: 'birthCertificate title',
      },
      acceptedFileTypes: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.acceptedFileTypes',
        defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
        description: 'Accepted file types',
      },
      buttonText: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.buttonText',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description: 'button file types',
      },
      incomeConfirmation: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.incomeConfirmation',
        defaultMessage: 'Gögn sem staðfesta trygga framfærslu',
        description: 'Income confirmation title',
      },
      incomeConfirmationTown: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.incomeConfirmationTown',
        defaultMessage: 'Framfærsluvottorð frá sveitarfélaginu',
        description: 'Income confirmation town title',
      },
      legalHome: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.legalHome',
        defaultMessage: 'Lögheimilissöguvottorð',
        description: 'Legal home title',
      },
      icelandicTest: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocuments.icelandicTest',
        defaultMessage: 'Staðfesting á íslenskuprófi eða gögn vegna undanþágu',
        description: 'Icelandic test title',
      },
    }),
    otherDocumentsChildren: defineMessages({
      birthCertificate: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocumentsChildren.birthCertificate',
        defaultMessage: 'Fæðingarvottorð',
        description: 'birthCertificate title',
      },
      writtenConsent: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocumentsChildren.writtenConsent',
        defaultMessage: 'Skriflegt samþykki barns (12-17 ára)',
        description: 'writtenConsent title',
      },
      otherParentConsent: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocumentsChildren.otherParentConsent',
        defaultMessage: 'Samþykki hins foreldrisins',
        description: 'otherParentConsent title',
      },
      custodyDocuments: {
        id: 'doi.cs.application:supportingDocuments.labels.otherDocumentsChildren.custodyDocuments',
        defaultMessage: 'Forsjárgögn (ef aðili fer ekki einn með forsjá)',
        description: 'custodyDocuments title',
      },
    }),
  },
}
