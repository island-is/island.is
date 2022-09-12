import { defineMessages } from '@formatjs/intl'

export const casefilesPdf = defineMessages({
  title: {
    id: 'judicial.system.backend:casefiles_pdf.title',
    defaultMessage: 'Rannsóknargögn {courtCaseNumber}',
    description: 'Notaður sem titill á rannsóknargagnaskjali í Auði.',
  },
  heading: {
    id: 'judicial.system.backend:casefiles_pdf.heading',
    defaultMessage: 'Rannsóknargögn',
    description: 'Notaður sem partur af titli á rannsóknargagnaskjali í Auði.',
  },
  courtCaseNumber: {
    id: 'judicial.system.backend:casefiles_pdf.court_case_number',
    defaultMessage: 'Mál nr. {courtCaseNumber}',
    description: 'Notaður sem partur af titli á rannsóknargagnaskjali í Auði.',
  },
})
