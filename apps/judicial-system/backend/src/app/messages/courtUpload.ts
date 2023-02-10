import { defineMessages } from 'react-intl'

export const courtUpload = defineMessages({
  request: {
    id: 'judicial.system.backend:court_upload.request',
    defaultMessage: 'Krafa um {caseType}{date}',
    description: 'Notaður sem nafn á kröfuskjali í Auði.',
  },
  caseFilesRecord: {
    id: 'judicial.system.backend:court_upload.case_files_record',
    defaultMessage: 'Skjalaskrá {policeCaseNumber}',
    description: 'Notaður sem nafn á skjalaskrá í Auði.',
  },
  courtRecord: {
    id: 'judicial.system.backend:court_upload.court_record',
    defaultMessage: 'Þingbók {courtCaseNumber}',
    description: 'Notaður sem nafn á þingbók í Auði.',
  },
  ruling: {
    id: 'judicial.system.backend:court_upload.ruling',
    defaultMessage:
      'Úrskurður {courtCaseNumber}{isModifyingRuling, select, true { leiðrétt} other {}}',
    description: 'Notaður sem nafn á úrskurði í Auði.',
  },
})
