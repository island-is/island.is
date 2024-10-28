import { defineMessages } from '@formatjs/intl'

export const courtUpload = defineMessages({
  request: {
    id: 'judicial.system.backend:court_upload.request_v2',
    defaultMessage: 'Krafa um {caseType} {date}',
    description: 'Notaður sem nafn á kröfuskjali í Auði.',
  },
  indictment: {
    id: 'judicial.system.backend:court_upload.indictment',
    defaultMessage: 'Ákæra',
    description: 'Notaður sem nafn á ákæru í Auði.',
  },
  caseFilesRecord: {
    id: 'judicial.system.backend:court_upload.case_files_record',
    defaultMessage: 'Skjalaskrá {policeCaseNumber}',
    description: 'Notaður sem nafn á skjalaskrá í Auði.',
  },
  courtRecord: {
    id: 'judicial.system.backend:court_upload.court_record_v2',
    defaultMessage: 'Þingbók {courtCaseNumber} {date}',
    description: 'Notaður sem nafn á þingbók í Auði.',
  },
  ruling: {
    id: 'judicial.system.backend:court_upload.ruling_v3',
    defaultMessage: 'Úrskurður {courtCaseNumber} {date}',
    description: 'Notaður sem nafn á úrskurði í Auði.',
  },
})
