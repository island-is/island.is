import { defineMessages } from 'react-intl'

export const courtUpload = defineMessages({
  courtRecord: {
    id: 'judicial.system.backend:court_upload.court_record',
    defaultMessage: 'Þingbók {courtCaseNumber}',
    description: 'Notaður sem nafn á þingbók í Auði.',
  },
  ruling: {
    id: 'judicial.system.backend:court_upload.ruling',
    defaultMessage: 'Úrskurður {courtCaseNumber}',
    description: 'Notaður sem nafn á úrskurði í Auði.',
  },
  rulingV2: {
    id: 'judicial.system.backend:court_upload.ruling_v2',
    defaultMessage:
      'Úrskurður {courtCaseNumber}{isModifyingRuling, select, true { leiðrétt} other {}}',
    description: 'Notaður sem nafn á úrskurði í Auði.',
  },
  requestFileName: {
    id: 'judicial.system.backend:court_upload.request_file_name',
    defaultMessage: 'Krafa um {caseType}',
    description: 'Notaður sem nafn á kröfuskjali í Auði.',
  },
})
