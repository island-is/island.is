import { defineMessages } from 'react-intl'

export const tables = defineMessages({
  caseNumber: {
    id: 'judicial.system.core:tables.case_number',
    defaultMessage: 'Málsnr.',
    description: 'Notaður sem titill fyrir málsnúmer dálk í lista yfir mál.',
  },
  type: {
    id: 'judicial.system.core:tables.type',
    defaultMessage: 'Tegund',
    description: 'Notaður sem titill fyrir tegund dálk í lista yfir mál.',
  },
  state: {
    id: 'judicial.system.core:tables.state',
    defaultMessage: 'Staða',
    description: 'Notaður sem titill fyrir staða dálk í lista yfir mál.',
  },
  duration: {
    id: 'judicial.system.core:tables.duration',
    defaultMessage: 'Gildistími',
    description: 'Notaður sem titill fyrir gildistíma dálk í lista yfir mál.',
  },
  appealDate: {
    id: 'judicial.system.core:tables.appeal_date',
    defaultMessage: 'Kært',
    description: 'Notaður sem titill fyrir kært dálk í lista yfir mál.',
  },
  newTag: {
    id: 'judicial.system.core:tables.new_tag',
    defaultMessage: 'Nýtt',
    description: 'Notað sem merki þegar mál í stöðu "Nýtt" í málalista',
  },
  receivedTag: {
    id: 'judicial.system.core:tables.received_tag',
    defaultMessage: 'Móttekið',
    description: 'Notað sem merki þegar mál í stöðu "Móttekið" í málalista',
  },
  completedTag: {
    id: 'judicial.system.core:tables.completed_tag',
    defaultMessage: 'Lokið',
    description: 'Notað sem merki þegar mál í stöðu "Lokið" í málalista',
  },
  completedCasesTitle: {
    id: 'judicial.system.core:tables.completed_cases_title',
    defaultMessage: 'Afgreidd mál',
    description: 'Notaður sem titill á lista yfir afgreidd mál.',
  },
  extension: {
    id: 'judicial.system.core:tables.extension',
    defaultMessage: 'Framlenging',
    description:
      'Notaður sem texti sem segir til um hvort mál sé framlenging í málalista.',
  },
  created: {
    id: 'judicial.system.core:tables.created',
    defaultMessage: 'Stofnað',
    description: 'Notaður sem titill fyrir stofnað dálk í lista yfir mál.',
  },
  hearingArrangementDate: {
    id: 'judicial.system.core:tables.hearing_arrangement_date',
    defaultMessage: 'Fyrirtaka',
    description: 'Notaður sem titill fyrir fyrirtöku dálk í lista yfir mál.',
  },
  filterIndictmentCaseLabel: {
    id: 'judicial.system.core:tables.filter_indictment_case_label',
    defaultMessage: 'Sakamál',
    description: 'Notaður sem titill fyrir Sakamál í síun.',
  },
  filterInvestigationCaseLabel: {
    id: 'judicial.system.core:tables.filter_investigation_case_label',
    defaultMessage: 'Rannsóknarmál',
    description: 'Notaður sem titill fyrir Rannsóknarmál í síun.',
  },
})
