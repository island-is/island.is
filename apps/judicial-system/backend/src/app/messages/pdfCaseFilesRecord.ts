import { defineMessages } from '@formatjs/intl'

export const caseFilesRecord = defineMessages({
  title: {
    id: 'judicial.system.backend:case_files_record.title',
    defaultMessage: 'SKJALASKRÁ',
    description: 'Notaður sem titill á PDF skjalaskrá',
  },
  policeCaseNumber: {
    id: 'judicial.system.backend:case_files_record.case_number',
    defaultMessage: 'Mál nr. {policeCaseNumber}',
    description: 'Notaður fyrir málsnúmer lögreglu í PDF skjalaskrá',
  },
  accused: {
    id: 'judicial.system.backend:case_files_record.accused_heading',
    defaultMessage: 'Sakborningur:',
    description: 'Nota[ur fyrir titil á skborningi í PDF skjalaskrá',
  },
  accusedOf: {
    id: 'judicial.system.backend:case_files_record.accused_of',
    defaultMessage: 'Sakarefni:',
    description: 'Notaður fyrir titil á sakarefni í PDF skjalaskrá',
  },
  tableOfContentsHeading: {
    id: 'judicial.system.backend:case_files_record.table_of_contents_heading',
    defaultMessage: 'Rannsóknargögn',
    description: 'Notaður sem titill á innihaldsskrá í PDF skjalaskrá',
  },
})
