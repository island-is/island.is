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
    id: 'judicial.system.backend:case_files_record.accused_heading_v2',
    defaultMessage: 'Sakborning{suffix}:',
    description: 'Notaður fyrir titil á sakborningi í PDF skjalaskrá',
  },
  accusedOf: {
    id: 'judicial.system.backend:case_files_record.accused_of',
    defaultMessage: 'Sakarefni:',
    description: 'Notaður fyrir titil á sakarefni í PDF skjalaskrá',
  },
  crimeScene: {
    id: 'judicial.system.backend:case_files_record.crime_scene',
    defaultMessage: 'Vettvangur/tími:',
    description: 'Notaður fyrir titil á vettvangi/tíma í PDF skjalaskrá',
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
  date: {
    id: 'judicial.system.backend:case_files_record.date',
    defaultMessage: 'Dags.',
    description: 'Notaður sem haus fyrir dags í PDF skjalaskrá',
  },
  chapterName: {
    id: 'judicial.system.backend:case_files_record.chapter',
    defaultMessage:
      '{chapter, select, 0 {1. Kæra og fylgiskjöl} 1 {2. Rannsóknartilvik} 2 {3. Vitni} 3 {4. Sakborningur} 4 {5. Réttarfarsgögn} 5 {6. Rafræn gögn}}',
    description: 'Notaður sem kaflaheiti í PDF skjalaskrá',
  },
})
