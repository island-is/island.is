import { defineMessages } from '@formatjs/intl'

export const caseFilesRecord = defineMessages({
  title: {
    id: 'judicial.system.backend:case_files_record.title',
    defaultMessage: 'Málsgögn - {policeCaseNumber}',
    description:
      'Notaður sem innri titill á PDF skjalaskrá, birtist í fllipa í vafra',
  },
  heading: {
    id: 'judicial.system.backend:case_files_record.heading',
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
  missingFile: {
    id: 'judicial.system.backend:case_files_record.missing_file',
    defaultMessage: 'Vantar Skjal',
    description:
      'Notaður sem titill á síðu þegar skjal vantar í PDF skjalaskrá',
  },
  pageNumberHeading: {
    id: 'judicial.system.backend:case_files_record.page_number_heading',
    defaultMessage: 'Bls.',
    description: 'Notaður sem haus fyrir blaðsíðutöl í PDF skjalaskrá',
  },
  chapterName: {
    id: 'judicial.system.backend:case_files_record.chapter',
    defaultMessage:
      '{chapter, select, 0 {Kæra og fylgiskjöl} 1 {Rannsóknartilvik} 2 {Vitni} 3 {Sakborningur} 4 {Réttarfarsgögn} 5 {Rafræn gögn}}',
    description: 'Notaður sem kaflaheiti í PDF skjalaskrá',
  },
})
