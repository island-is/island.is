import { defineMessages } from 'react-intl'

export const courtUpload = defineMessages({
  request: {
    id: 'judicial.system.backend:court_upload.request',
    defaultMessage: 'Krafa um {caseType}{date}',
    description: 'Notaður sem nafn á kröfuskjali í Auði.',
  },
  coverLetter: {
    id: 'judicial.system.backend:court_upload.cover_letter',
    defaultMessage: 'Fylgibréf {courtCaseNumber}',
    description: 'Notaður sem nafn á fylgibréfi í Auði.',
  },
  indictment: {
    id: 'judicial.system.backend:court_upload.indictment',
    defaultMessage: 'Ákæra {courtCaseNumber}',
    description: 'Notaður sem nafn á ákæru í Auði.',
  },
  criminalRecord: {
    id: 'judicial.system.backend:court_upload.criminal_record',
    defaultMessage: 'Sakavottorð {courtCaseNumber}',
    description: 'Notaður sem nafn á sakavottorði í Auði.',
  },
  costBreakdown: {
    id: 'judicial.system.backend:court_upload.cost_breakdown',
    defaultMessage: 'Sakarkostnaður {courtCaseNumber}',
    description: 'Notaður sem nafn á sakarkostnaði í Auði.',
  },
  caseFileContents: {
    id: 'judicial.system.backend:court_upload.case_file_contents',
    defaultMessage: 'Skjalaskrá {courtCaseNumber}',
    description: 'Notaður sem nafn á skjalaskrá í Auði.',
  },
  caseFile: {
    id: 'judicial.system.backend:court_upload.case_file',
    defaultMessage: 'Málsgögn {courtCaseNumber}',
    description: 'Notaður sem nafn á málsgögnum í Auði.',
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
  verdict: {
    id: 'judicial.system.backend:court_upload.verdict',
    defaultMessage: 'Dómur {courtCaseNumber}',
    description: 'Notaður sem nafn á dómi í Auði.',
  },
})
