import { defineMessages } from 'react-intl'

export const error = defineMessages({
  invalidValue: {
    id: 'ol.application:error.invalidValue',
    defaultMessage: 'Ógilt gildi.',
    description: 'Error message when a value is invalid.',
  },
  attachments: {
    id: 'ol.application:error.attachments',
    defaultMessage: 'Ætti að innihalda a.m.k. þrjú skjöl.',
    description: 'Error message when a value is invalid.',
  },
  openingHours: {
    id: 'ol.application:error.openingHours',
    defaultMessage: 'Vinsamlegast fylltu út afgreiðslutíma.',
    description: 'Error message when a value is invalid.',
  },
  hoursFormat: {
    id: 'ol.application:error.hoursFormat',
    defaultMessage: 'Verður að fylla út og vera á milli 00:00 - 23:59',
    description:
      'Error message when 24h time values are not filled out or not between 00:00 and 23:59',
  },
  debug: {
    id: 'ol.application:error.debug',
    defaultMessage: 'DEBUG',
    description: 'Error message when a value is invalid.',
  },
  dataCollectionCriminalRecordErrorTitle: {
    id: 'ol.application:missingCriominalRecordTitle',
    defaultMessage: 'Skilyrði um hreina sakaskrá er ekki uppfyllt',
    description: '',
  },
  dataCollectionCriminalRecordTitle: {
    id: 'ol.application:dataCollection.criminalRecordTitle',
    defaultMessage: 'Sakaskrá ríkisins',
    description: 'Some description',
  },
  missingCertificateTitle: {
    id: 'ol.application:missingCertificateTitle',
    defaultMessage: 'Ekki tókst að staðfesta skuldleysi',
    description: '',
  },
  missingCertificateSummary: {
    id: 'ol.application:missingCertificateSummary',
    defaultMessage:
      'Staðfesting á skuldleysi fékkst ekki úr gagnagrunni Fjársýslu ríkisins',
    description: '',
  },
  missingJudicialAdministrationificateTitle: {
    id: 'ol.application:missingJudicialAdministrationificateTitle',
    defaultMessage: 'Ekki tókst að staðfesta búsforræðisvottorð',
    description: '',
  },
  missingJudicialAdministrationificateSummary: {
    id: 'ol.application:missingJudicialAdministrationificateSummary',
    defaultMessage:
      'Staðfesting á skuldleysi fékkst ekki úr gagnagrunni Dómstólasýslu ríkisins',
    description: '',
  },
  missingAddressForPropertyNumber: {
    id: 'ol.application:missingAddressForPropertyNumber',
    defaultMessage: 'Fasteignanúmer ekki til eða villa við að sækja gögn.',
    description: 'Error message when a value is invalid for property.',
  },
})
